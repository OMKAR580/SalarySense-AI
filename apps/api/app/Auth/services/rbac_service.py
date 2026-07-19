import logging
from datetime import datetime, timezone
from typing import List, Dict, Set, Optional, Any
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.Auth.models.role import Role
from app.Auth.models.permission import Permission
from app.Auth.models.user_role import UserRole
from app.Auth.models.role_permission import RolePermission
from app.Auth.models.user import User
from app.Auth.models.audit_log import AuditLog
from app.Auth.services.permission_cache import permission_cache

logger = logging.getLogger(__name__)

ROLE_HIERARCHY = {
    "SUPER_ADMIN": ["ADMIN"],
    "ADMIN": ["MANAGER"],
    "MANAGER": ["USER"],
    "USER": ["GUEST"],
    "GUEST": []
}

def get_effective_roles(role_names: List[str]) -> Set[str]:
    effective = set(role_names)
    queue = list(role_names)
    while queue:
        current = queue.pop(0)
        inherited = ROLE_HIERARCHY.get(current, [])
        for r in inherited:
            if r not in effective:
                effective.add(r)
                queue.append(r)
    return effective

def match_permission(assigned: str, required: str) -> bool:
    if assigned == "*" or assigned == "*:*":
        return True
    if ":" not in assigned or ":" not in required:
        return assigned == required
    
    assigned_res, assigned_act = assigned.split(":", 1)
    required_res, required_act = required.split(":", 1)
    
    if assigned_res == "*" or assigned_res == required_res:
        if assigned_act == "*" or assigned_act == required_act:
            return True
    return False

class RbacService:
    def __init__(self, db: AsyncSession, audit: Optional[Any] = None):
        self.db = db
        self.audit = audit

    async def create_role(self, name: str, description: Optional[str] = None, is_system: bool = False) -> Role:
        # Check duplicate
        query = select(Role).filter(Role.name == name)
        res = await self.db.execute(query)
        if res.scalars().first():
            raise ValueError(f"Role with name '{name}' already exists.")

        role = Role(
            name=name,
            description=description,
            is_system=is_system
        )
        self.db.add(role)
        await self.db.flush()
        return role

    async def delete_role(self, role_id: UUID) -> None:
        query = select(Role).filter(Role.id == role_id)
        res = await self.db.execute(query)
        role = res.scalars().first()
        if not role:
            raise ValueError("Role not found.")
        if role.is_system:
            raise ValueError("System roles cannot be deleted.")

        # Delete role assignments & associations
        await self.db.execute(delete(UserRole).filter(UserRole.role_id == role_id))
        await self.db.execute(delete(RolePermission).filter(RolePermission.role_id == role_id))
        await self.db.delete(role)
        await self.db.flush()

    async def assign_role_to_user(
        self,
        user_id: UUID,
        role_id: UUID,
        assigned_by: Optional[UUID] = None,
        expires_at: Optional[datetime] = None
    ) -> None:
        # Verify user & role exist
        user_query = select(User).filter(User.id == user_id)
        res_user = await self.db.execute(user_query)
        user = res_user.scalars().first()
        if not user:
            raise ValueError("User not found.")

        role_query = select(Role).filter(Role.id == role_id)
        res_role = await self.db.execute(role_query)
        role = res_role.scalars().first()
        if not role:
            raise ValueError("Role not found.")

        # Check existing
        link_query = select(UserRole).filter(UserRole.user_id == user_id, UserRole.role_id == role_id)
        res_link = await self.db.execute(link_query)
        if res_link.scalars().first():
            raise ValueError("Role is already assigned to this user.")

        user_role = UserRole(
            user_id=user_id,
            role_id=role_id,
            assigned_by=assigned_by,
            expires_at=expires_at
        )
        self.db.add(user_role)

        # Audit
        log = AuditLog(
            actor_id=assigned_by,
            target_id=user_id,
            action="USER_ROLE_ASSIGNED",
            entity="UserRole",
            changes={"role": role.name, "expires_at": expires_at.isoformat() if expires_at else None}
        )
        self.db.add(log)

        await self.db.flush()
        permission_cache.invalidate(user_id)
        from app.Auth.services.cache_service import cache_service
        await cache_service.invalidate_user_permissions(user_id)

    async def remove_role_from_user(self, user_id: UUID, role_id: UUID, actor_id: Optional[UUID] = None) -> None:
        query = select(UserRole).filter(UserRole.user_id == user_id, UserRole.role_id == role_id)
        res = await self.db.execute(query)
        link = res.scalars().first()
        if not link:
            raise ValueError("Role is not assigned to this user.")

        role_query = select(Role).filter(Role.id == role_id)
        res_role = await self.db.execute(role_query)
        role = res_role.scalars().first()

        await self.db.delete(link)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=user_id,
            action="USER_ROLE_REMOVED",
            entity="UserRole",
            changes={"role": role.name if role else str(role_id)}
        )
        self.db.add(log)

        await self.db.flush()
        permission_cache.invalidate(user_id)
        from app.Auth.services.cache_service import cache_service
        await cache_service.invalidate_user_permissions(user_id)

    async def add_permission(self, resource: str, action: str, description: Optional[str] = None) -> Permission:
        # Check duplicate
        query = select(Permission).filter(Permission.resource == resource, Permission.action == action)
        res = await self.db.execute(query)
        if res.scalars().first():
            raise ValueError(f"Permission '{resource}:{action}' already exists.")

        permission = Permission(
            resource=resource,
            action=action,
            description=description
        )
        self.db.add(permission)
        await self.db.flush()
        return permission

    async def remove_permission(self, permission_id: UUID) -> None:
        query = select(Permission).filter(Permission.id == permission_id)
        res = await self.db.execute(query)
        permission = res.scalars().first()
        if not permission:
            raise ValueError("Permission not found.")

        await self.db.execute(delete(RolePermission).filter(RolePermission.permission_id == permission_id))
        await self.db.delete(permission)
        await self.db.flush()
        permission_cache.clear()

    async def assign_permission_to_role(self, role_id: UUID, permission_id: UUID) -> None:
        query = select(RolePermission).filter(
            RolePermission.role_id == role_id,
            RolePermission.permission_id == permission_id
        )
        res = await self.db.execute(query)
        if res.scalars().first():
            return

        rp = RolePermission(role_id=role_id, permission_id=permission_id)
        self.db.add(rp)
        await self.db.flush()
        permission_cache.clear()

    async def remove_permission_from_role(self, role_id: UUID, permission_id: UUID) -> None:
        query = select(RolePermission).filter(
            RolePermission.role_id == role_id,
            RolePermission.permission_id == permission_id
        )
        res = await self.db.execute(query)
        rp = res.scalars().first()
        if rp:
            await self.db.delete(rp)
            await self.db.flush()
            permission_cache.clear()

    async def get_user_roles(self, user_id: UUID) -> List[Role]:
        # Filter out expired assignments
        query = select(Role).join(UserRole, UserRole.role_id == Role.id).filter(
            UserRole.user_id == user_id
        )
        res = await self.db.execute(query)
        roles = list(res.scalars().all())

        # Check expirations
        active_roles = []
        for r in roles:
            link_query = select(UserRole).filter(UserRole.user_id == user_id, UserRole.role_id == r.id)
            link_res = await self.db.execute(link_query)
            link = link_res.scalars().first()
            if link and link.expires_at and datetime.now(timezone.utc) > link.expires_at.replace(tzinfo=timezone.utc if link.expires_at.tzinfo is None else link.expires_at.tzinfo):
                # Clean up expired link
                await self.db.delete(link)
                await self.db.flush()
            else:
                active_roles.append(r)
        return active_roles

    async def get_user_permissions(self, user_id: UUID) -> List[str]:
        # 1. Check cache first
        from app.Auth.services.cache_service import cache_service
        cached_redis = await cache_service.get_user_permissions(user_id)
        if cached_redis is not None:
            return cached_redis

        cached = permission_cache.get_permissions(user_id)
        if cached is not None:
            return cached

        # 2. Fetch active roles
        roles = await self.get_user_roles(user_id)
        role_names = [r.name for r in roles]
        effective_roles = get_effective_roles(role_names)

        # 3. Handle SUPER_ADMIN shortcut
        if "SUPER_ADMIN" in effective_roles:
            permissions = ["*"]
            permission_cache.set_permissions(user_id, permissions)
            return permissions

        # 4. Load from DB
        permissions = set()
        
        # Load explicit permissions of effective roles
        if effective_roles:
            query = select(Permission).join(RolePermission).join(Role).filter(
                Role.name.in_(list(effective_roles))
            )
            res = await self.db.execute(query)
            for p in res.scalars().all():
                permissions.add(f"{p.resource}:{p.action}")

        # 5. Load default permissions for hardcoded system roles in hierarchy
        for role_name in effective_roles:
            if role_name == "ADMIN":
                permissions.update(["users:*", "roles:*", "settings:view"])
            elif role_name == "MANAGER":
                permissions.update(["users:read", "reports:view"])
            elif role_name == "USER":
                permissions.update(["profile:view", "profile:update"])
            elif role_name == "GUEST":
                permissions.update(["profile:view"])

        permission_list = sorted(list(permissions))
        permission_cache.set_permissions(user_id, permission_list)
        from app.Auth.services.cache_service import cache_service
        await cache_service.set_user_permissions(user_id, permission_list)
        return permission_list

    async def check_permission(self, user_id: UUID, required_permission: str) -> bool:
        user_permissions = await self.get_user_permissions(user_id)
        for assigned in user_permissions:
            if match_permission(assigned, required_permission):
                return True
        return False
