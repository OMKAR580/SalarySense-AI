from datetime import datetime, timezone
from typing import Any, Optional
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.refresh_token import RefreshToken
from app.Auth.repositories.base import BaseRepository

class RefreshTokenRepository(BaseRepository[RefreshToken, Any, Any]):
    def __init__(self):
        super().__init__(RefreshToken)

    async def create_token(self, db: AsyncSession, token_data: dict) -> RefreshToken:
        """
        Purpose: Create a refresh token.
        Arguments:
            db: AsyncSession
            token_data: dict
        Return Type: RefreshToken
        Raises: None
        """
        return await self.create(db, obj_in=token_data)

    async def get_token(self, db: AsyncSession, token: str) -> Optional[RefreshToken]:
        """
        Purpose: Get a refresh token by string.
        Arguments:
            db: AsyncSession
            token: str
        Return Type: Optional[RefreshToken]
        Raises: None
        """
        query = select(self.model).filter(self.model.token == token)
        result = await db.execute(query)
        return result.scalars().first()

    async def revoke(self, db: AsyncSession, token: str) -> Optional[RefreshToken]:
        """
        Purpose: Revoke a specific refresh token.
        Arguments:
            db: AsyncSession
            token: str
        Return Type: Optional[RefreshToken]
        Raises: None
        """
        rt = await self.get_token(db, token)
        if rt:
            rt.revoked_at = datetime.now(timezone.utc)
            db.add(rt)
            await db.flush()
        return rt

    async def revoke_all(self, db: AsyncSession, user_id: UUID) -> None:
        """
        Purpose: Revoke all tokens for a user.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: None
        Raises: None
        """
        query = select(self.model).filter(self.model.user_id == user_id, self.model.revoked_at == None)
        result = await db.execute(query)
        tokens = result.scalars().all()
        for t in tokens:
            t.revoked_at = datetime.now(timezone.utc)
            db.add(t)
        await db.flush()

    async def cleanup_expired(self, db: AsyncSession) -> None:
        """
        Purpose: Delete expired tokens.
        Arguments:
            db: AsyncSession
        Return Type: None
        Raises: None
        """
        query = delete(self.model).filter(self.model.expires_at <= datetime.now(timezone.utc))
        await db.execute(query)
        await db.flush()

    async def revoke_refresh_family(self, db: AsyncSession, token_hash: str) -> None:
        """
        Purpose: Revoke a token family (the token and all connected parent/child tokens in rotation).
        """
        visited = set()
        to_check = [token_hash]
        while to_check:
            current = to_check.pop(0)
            if current in visited:
                continue
            visited.add(current)
            
            # Fetch token by hash or token string
            query = select(self.model).filter(self.model.token_hash == current)
            result = await db.execute(query)
            rt = result.scalars().first()
            
            if rt:
                rt.revoked_at = datetime.now(timezone.utc)
                db.add(rt)
                
                # Check tokens that were replaced by this token
                if rt.replaced_by_token:
                    to_check.append(rt.replaced_by_token)
                
                # Check tokens that replaced this token
                child_query = select(self.model).filter(self.model.replaced_by_token == rt.token_hash)
                child_res = await db.execute(child_query)
                children = child_res.scalars().all()
                for child in children:
                    to_check.append(child.token_hash)
        await db.flush()

refresh_token_repository = RefreshTokenRepository()
