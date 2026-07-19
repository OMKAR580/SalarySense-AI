import logging
from datetime import datetime, timezone
from typing import List, Optional, Any
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.models.user import User
from app.Auth.models.role import Role
from app.Auth.models.user_role import UserRole
from app.Auth.models.audit_log import AuditLog
from app.Auth.repositories.user import UserRepository

logger = logging.getLogger(__name__)

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    async def list_users(
        self,
        db: AsyncSession,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None
    ) -> List[User]:
        query = select(User).filter(User.deleted_at == None)
        if search:
            query = query.filter(
                (User.email.ilike(f"%{search}%")) | (User.username.ilike(f"%{search}%"))
            )
        query = query.offset((page - 1) * limit).limit(limit)
        res = await db.execute(query)
        return list(res.scalars().all())

    async def get_user_detail(self, db: AsyncSession, user_id: UUID) -> User:
        query = select(User).filter(User.id == user_id)
        res = await db.execute(query)
        user = res.scalars().first()
        if not user:
            raise ValueError("User not found.")
        return user

    async def update_user(
        self,
        db: AsyncSession,
        user_id: UUID,
        actor_id: UUID,
        is_active: Optional[bool] = None,
        is_verified: Optional[bool] = None,
        role_ids: Optional[List[UUID]] = None,
        metadata: Optional[dict] = None
    ) -> User:
        user = await self.get_user_detail(db, user_id)
        changes = {}

        if is_active is not None:
            changes["is_active"] = {"old": user.is_active, "new": is_active}
            user.is_active = is_active

        if is_verified is not None:
            changes["is_verified"] = {"old": user.is_verified, "new": is_verified}
            user.is_verified = is_verified

        if role_ids is not None:
            # Load active roles
            from app.Auth.services.rbac_service import RbacService
            rbac = RbacService(db)
            current_roles = await rbac.get_user_roles(user_id)
            current_ids = {r.id for r in current_roles}
            target_ids = set(role_ids)

            # Assign new ones
            for r_id in target_ids - current_ids:
                await rbac.assign_role_to_user(user_id, r_id, assigned_by=actor_id)
            # Remove unselected
            for r_id in current_ids - target_ids:
                await rbac.remove_role_from_user(user_id, r_id, actor_id=actor_id)

            changes["roles"] = {"old": list(map(str, current_ids)), "new": list(map(str, target_ids))}

        if metadata is not None:
            changes["metadata"] = metadata
            if hasattr(user, "metadata"):
                user.metadata = metadata

        db.add(user)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=user_id,
            action="USER_UPDATED",
            entity="User",
            changes=changes
        )
        db.add(log)

        await db.flush()
        return user

    async def delete_user(self, db: AsyncSession, user_id: UUID, actor_id: UUID) -> None:
        user = await self.get_user_detail(db, user_id)
        
        # Hard delete the user to completely erase them from the database
        await db.delete(user)

        # Audit Log (actor_id points to the admin or user deleting the account)
        log = AuditLog(
            actor_id=actor_id,
            target_id=user_id,
            action="USER_DELETED",
            entity="User",
            changes={"status": "hard_deleted"}
        )
        db.add(log)
        await db.flush()
