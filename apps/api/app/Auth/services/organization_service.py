import logging
from datetime import datetime, timezone
from typing import List, Optional, Any
from uuid import UUID, uuid4
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.models.organization import Organization
from app.Auth.models.organization_member import OrganizationMember
from app.Auth.models.user import User
from app.Auth.models.role import Role
from app.Auth.models.audit_log import AuditLog

logger = logging.getLogger(__name__)

class OrganizationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_organization(
        self,
        name: str,
        slug: str,
        owner_id: UUID,
        description: Optional[str] = None
    ) -> Organization:
        # Check duplicate slug
        query = select(Organization).filter(Organization.slug == slug, Organization.deleted_at == None)
        res = await self.db.execute(query)
        if res.scalars().first():
            raise ValueError(f"Organization with slug '{slug}' already exists.")

        org = Organization(
            name=name,
            slug=slug,
            owner_id=owner_id,
            description=description,
            is_active=True
        )
        self.db.add(org)
        await self.db.flush()

        # Add owner to members
        member = OrganizationMember(
            id=uuid4(),
            organization_id=org.id,
            user_id=owner_id,
            status="active",
            is_active=True
        )
        self.db.add(member)

        # Audit
        log = AuditLog(
            actor_id=owner_id,
            target_id=org.id,
            action="ORGANIZATION_CREATED",
            entity="Organization",
            changes={"name": name, "slug": slug}
        )
        self.db.add(log)
        await self.db.flush()

        return org

    async def update_organization(
        self,
        org_id: UUID,
        actor_id: UUID,
        name: Optional[str] = None,
        slug: Optional[str] = None,
        description: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> Organization:
        org = await self.get_organization(org_id)
        changes = {}

        if name is not None:
            changes["name"] = {"old": org.name, "new": name}
            org.name = name

        if slug is not None:
            # Check duplicate slug
            query = select(Organization).filter(
                Organization.slug == slug,
                Organization.id != org_id,
                Organization.deleted_at == None
            )
            res = await self.db.execute(query)
            if res.scalars().first():
                raise ValueError(f"Organization with slug '{slug}' already exists.")
            changes["slug"] = {"old": org.slug, "new": slug}
            org.slug = slug

        if description is not None:
            changes["description"] = {"old": org.description, "new": description}
            org.description = description

        if is_active is not None:
            changes["is_active"] = {"old": org.is_active, "new": is_active}
            org.is_active = is_active

        self.db.add(org)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=org_id,
            action="ORGANIZATION_UPDATED",
            entity="Organization",
            changes=changes
        )
        self.db.add(log)
        await self.db.flush()

        return org

    async def delete_organization(self, org_id: UUID, actor_id: UUID) -> None:
        org = await self.get_organization(org_id)
        org.deleted_at = datetime.now(timezone.utc)
        org.is_active = False
        self.db.add(org)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=org_id,
            action="ORGANIZATION_DELETED",
            entity="Organization",
            changes={"status": "deleted"}
        )
        self.db.add(log)
        await self.db.flush()

    async def get_organization(self, org_id: UUID) -> Organization:
        query = select(Organization).filter(Organization.id == org_id, Organization.deleted_at == None)
        res = await self.db.execute(query)
        org = res.scalars().first()
        if not org:
            raise ValueError("Organization not found.")
        return org

    async def list_organizations(
        self,
        page: int = 1,
        limit: int = 20
    ) -> List[Organization]:
        query = select(Organization).filter(Organization.deleted_at == None)
        query = query.offset((page - 1) * limit).limit(limit)
        res = await self.db.execute(query)
        return list(res.scalars().all())

    # --- Membership Management ---

    async def invite_user(
        self,
        org_id: UUID,
        email: str,
        role_id: Optional[UUID] = None,
        invited_by: Optional[UUID] = None
    ) -> OrganizationMember:
        # Load user
        query_user = select(User).filter(User.email == email, User.deleted_at == None)
        res_user = await self.db.execute(query_user)
        user = res_user.scalars().first()
        if not user:
            raise ValueError(f"User with email '{email}' not found.")

        # Check existing membership
        query_member = select(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user.id
        )
        res_member = await self.db.execute(query_member)
        if res_member.scalars().first():
            raise ValueError("User is already a member of this organization.")

        member = OrganizationMember(
            id=uuid4(),
            organization_id=org_id,
            user_id=user.id,
            role_id=role_id,
            invited_by=invited_by,
            status="invited",
            is_active=True
        )
        self.db.add(member)

        # Audit
        log = AuditLog(
            actor_id=invited_by,
            target_id=user.id,
            action="ORGANIZATION_MEMBER_INVITED",
            entity="OrganizationMember",
            changes={"organization_id": str(org_id), "role_id": str(role_id) if role_id else None}
        )
        self.db.add(log)
        await self.db.flush()

        return member

    async def remove_user_from_org(self, org_id: UUID, user_id: UUID, actor_id: Optional[UUID] = None) -> None:
        query = select(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user_id
        )
        res = await self.db.execute(query)
        member = res.scalars().first()
        if not member:
            raise ValueError("User is not a member of this organization.")

        await self.db.delete(member)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=user_id,
            action="ORGANIZATION_MEMBER_REMOVED",
            entity="OrganizationMember",
            changes={"organization_id": str(org_id)}
        )
        self.db.add(log)
        await self.db.flush()

    async def change_member_role(
        self,
        org_id: UUID,
        user_id: UUID,
        role_id: UUID,
        actor_id: Optional[UUID] = None
    ) -> OrganizationMember:
        query = select(OrganizationMember).filter(
            OrganizationMember.organization_id == org_id,
            OrganizationMember.user_id == user_id
        )
        res = await self.db.execute(query)
        member = res.scalars().first()
        if not member:
            raise ValueError("User is not a member of this organization.")

        # Verify role exists
        query_role = select(Role).filter(Role.id == role_id)
        res_role = await self.db.execute(query_role)
        if not res_role.scalars().first():
            raise ValueError("Role not found.")

        old_role_id = member.role_id
        member.role_id = role_id
        self.db.add(member)

        # Audit
        log = AuditLog(
            actor_id=actor_id,
            target_id=user_id,
            action="ORGANIZATION_MEMBER_ROLE_CHANGED",
            entity="OrganizationMember",
            changes={"old_role_id": str(old_role_id) if old_role_id else None, "new_role_id": str(role_id)}
        )
        self.db.add(log)
        await self.db.flush()

        return member

    async def list_members(self, org_id: UUID) -> List[OrganizationMember]:
        query = select(OrganizationMember).filter(OrganizationMember.organization_id == org_id)
        res = await self.db.execute(query)
        return list(res.scalars().all())
