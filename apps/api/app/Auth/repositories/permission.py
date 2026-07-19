from typing import Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.permission import Permission
from app.Auth.repositories.base import BaseRepository

class PermissionRepository(BaseRepository[Permission, Any, Any]):
    def __init__(self):
        super().__init__(Permission)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Permission]:
        """
        Purpose: Get permission by name.
        Arguments:
            db: AsyncSession
            name: str
        Return Type: Optional[Permission]
        Raises: None
        """
        query = select(self.model).filter(self.model.name == name)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_resource(self, db: AsyncSession, resource: str) -> list[Permission]:
        """
        Purpose: Get permissions by resource.
        Arguments:
            db: AsyncSession
            resource: str
        Return Type: list[Permission]
        Raises: None
        """
        query = select(self.model).filter(self.model.resource == resource)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_by_action(self, db: AsyncSession, action: str) -> list[Permission]:
        """
        Purpose: Get permissions by action.
        Arguments:
            db: AsyncSession
            action: str
        Return Type: list[Permission]
        Raises: None
        """
        query = select(self.model).filter(self.model.action == action)
        result = await db.execute(query)
        return list(result.scalars().all())

permission_repository = PermissionRepository()
