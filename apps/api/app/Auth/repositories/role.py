from typing import Any, List, Optional
from uuid import UUID

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.Auth.models.role import Role
from app.Auth.models.user_role import UserRole
from app.Auth.models.permission import Permission
from app.Auth.repositories.base import BaseRepository


class RoleRepository(BaseRepository[Role, Any, Any]):
    def __init__(self):
        super().__init__(Role)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Role]:
        """
        Purpose: Get a role by its unique name.
        Arguments:
            db: AsyncSession
            name: str
        Return Type: Optional[Role]
        Raises: None
        """
        query = select(self.model).filter(self.model.name == name)
        result = await db.execute(query)
        return result.scalars().first()

    async def assign_role(self, db: AsyncSession, user_id: UUID, role_id: UUID) -> UserRole:
        """
        Purpose: Assign a role to a user.
        Arguments:
            db: AsyncSession
            user_id: UUID
            role_id: UUID
        Return Type: UserRole
        Raises: None
        """
        user_role = UserRole(user_id=user_id, role_id=role_id)
        db.add(user_role)
        await db.flush()
        return user_role

    async def remove_role(self, db: AsyncSession, user_id: UUID, role_id: UUID) -> None:
        """
        Purpose: Remove a role from a user.
        Arguments:
            db: AsyncSession
            user_id: UUID
            role_id: UUID
        Return Type: None
        Raises: None
        """
        query = delete(UserRole).filter(
            UserRole.user_id == user_id,
            UserRole.role_id == role_id
        )
        await db.execute(query)
        await db.flush()

    async def list_user_roles(self, db: AsyncSession, user_id: UUID) -> List[Role]:
        """
        Purpose: List all roles for a specific user.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: List[Role]
        Raises: None
        """
        query = (
            select(self.model)
            .join(UserRole, UserRole.role_id == self.model.id)
            .filter(UserRole.user_id == user_id)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def list_permissions(self, db: AsyncSession, role_id: UUID) -> List[Permission]:
        """
        Purpose: List all permissions associated with a role.
        Arguments:
            db: AsyncSession
            role_id: UUID
        Return Type: List[Permission]
        Raises: None
        """
        query = (
            select(self.model)
            .options(selectinload(self.model.permissions))
            .filter(self.model.id == role_id)
        )
        result = await db.execute(query)
        role = result.scalars().first()
        if role:
            return role.permissions
        return []

role_repository = RoleRepository()
