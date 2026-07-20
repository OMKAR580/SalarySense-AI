from datetime import datetime, timezone
from typing import Any, Optional, List
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.password_reset_token import PasswordResetToken
from app.Auth.repositories.base import BaseRepository

class PasswordResetRepository(BaseRepository[PasswordResetToken, Any, Any]):
    def __init__(self):
        super().__init__(PasswordResetToken)

    async def create_token(self, db: AsyncSession, data: dict) -> PasswordResetToken:
        """
        Purpose: Create reset token.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: PasswordResetToken
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def validate_token(self, db: AsyncSession, token: str) -> Optional[PasswordResetToken]:
        """
        Purpose: Validate a reset token.
        Arguments:
            db: AsyncSession
            token: str
        Return Type: Optional[PasswordResetToken]
        Raises: None
        """
        query = select(self.model).filter(
            self.model.token == token,
            self.model.is_used == False,
            self.model.expires_at > datetime.utcnow()
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def mark_used(self, db: AsyncSession, token_id: Any) -> Optional[PasswordResetToken]:
        """
        Purpose: Mark token as used.
        Arguments:
            db: AsyncSession
            token_id: Any
        Return Type: Optional[PasswordResetToken]
        Raises: None
        """
        token = await self.get_by_id(db, token_id)
        if token:
            token.is_used = True
            db.add(token)
            await db.flush()
        return token

    async def get_tokens_by_user(self, db: AsyncSession, user_id: Any) -> List[PasswordResetToken]:
        """
        Purpose: Get all password reset tokens for a user ordered by created_at desc.
        """
        query = select(self.model).filter(self.model.user_id == user_id).order_by(self.model.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

    async def cleanup(self, db: AsyncSession) -> None:
        """
        Purpose: Cleanup old tokens.
        Arguments:
            db: AsyncSession
        Return Type: None
        Raises: None
        """
        query = delete(self.model).filter(self.model.expires_at <= datetime.utcnow())
        await db.execute(query)
        await db.flush()

password_reset_repository = PasswordResetRepository()
