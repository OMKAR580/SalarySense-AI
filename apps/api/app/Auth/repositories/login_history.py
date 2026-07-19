from typing import Any, List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.login_history import LoginHistory
from app.Auth.repositories.base import BaseRepository

class LoginHistoryRepository(BaseRepository[LoginHistory, Any, Any]):
    def __init__(self):
        super().__init__(LoginHistory)

    async def record_login(self, db: AsyncSession, data: dict) -> LoginHistory:
        """
        Purpose: Record a login attempt.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: LoginHistory
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def recent_logins(self, db: AsyncSession, user_id: UUID, limit: int = 10) -> List[LoginHistory]:
        """
        Purpose: Get recent logins for user.
        Arguments:
            db: AsyncSession
            user_id: UUID
            limit: int
        Return Type: List[LoginHistory]
        Raises: None
        """
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.is_success == True
        ).order_by(self.model.created_at.desc()).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def failed_attempts(self, db: AsyncSession, user_id: UUID, limit: int = 10) -> List[LoginHistory]:
        """
        Purpose: Get recent failed attempts.
        Arguments:
            db: AsyncSession
            user_id: UUID
            limit: int
        Return Type: List[LoginHistory]
        Raises: None
        """
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.is_success == False
        ).order_by(self.model.created_at.desc()).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

login_history_repository = LoginHistoryRepository()
