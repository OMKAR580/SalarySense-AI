from typing import Any, List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.two_factor_method import TwoFactorMethod
from app.Auth.repositories.base import BaseRepository

class TwoFactorRepository(BaseRepository[TwoFactorMethod, Any, Any]):
    def __init__(self):
        super().__init__(TwoFactorMethod)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[TwoFactorMethod]:
        query = select(self.model).filter(self.model.user_id == user_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_verified_by_user(self, db: AsyncSession, user_id: UUID) -> List[TwoFactorMethod]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.is_verified == True
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_by_user_and_type(self, db: AsyncSession, user_id: UUID, method_type: str) -> Optional[TwoFactorMethod]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.method_type == method_type
        )
        result = await db.execute(query)
        return result.scalars().first()

two_factor_repository = TwoFactorRepository()