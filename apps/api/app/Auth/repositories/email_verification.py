from datetime import datetime, timezone
from typing import Any, Optional
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.email_verification_token import EmailVerificationToken
from app.Auth.repositories.base import BaseRepository

class EmailVerificationRepository(BaseRepository[EmailVerificationToken, Any, Any]):
    def __init__(self):
        super().__init__(EmailVerificationToken)

    async def create_token(self, db: AsyncSession, data: dict) -> EmailVerificationToken:
        """
        Purpose: Create verification token.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: EmailVerificationToken
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def validate(self, db: AsyncSession, token: str) -> Optional[EmailVerificationToken]:
        """
        Purpose: Validate a token without marking it used.
        Arguments:
            db: AsyncSession
            token: str
        Return Type: Optional[EmailVerificationToken]
        Raises: None
        """
        from app.Auth.security.crypto import sha256
        hashed = sha256(token)
        query = select(self.model).filter(
            self.model.token_hash == hashed,
            self.model.is_used == False,
            self.model.expires_at > datetime.now(timezone.utc)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def verify(self, db: AsyncSession, token_id: Any) -> Optional[EmailVerificationToken]:
        """
        Purpose: Mark as verified/used.
        Arguments:
            db: AsyncSession
            token_id: Any
        Return Type: Optional[EmailVerificationToken]
        Raises: None
        """
        t = await self.get_by_id(db, token_id)
        if t:
            t.is_used = True
            db.add(t)
            await db.flush()
        return t

    async def cleanup(self, db: AsyncSession) -> None:
        """
        Purpose: Cleanup old tokens.
        Arguments:
            db: AsyncSession
        Return Type: None
        Raises: None
        """
        query = delete(self.model).filter(self.model.expires_at <= datetime.now(timezone.utc))
        await db.execute(query)
        await db.flush()

email_verification_repository = EmailVerificationRepository()
