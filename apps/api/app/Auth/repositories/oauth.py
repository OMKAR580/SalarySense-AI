from typing import Any, List, Optional
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.oauth_account import OAuthAccount
from app.Auth.repositories.base import BaseRepository

class OAuthRepository(BaseRepository[OAuthAccount, Any, Any]):
    def __init__(self):
        super().__init__(OAuthAccount)

    async def link_account(self, db: AsyncSession, data: dict) -> OAuthAccount:
        """
        Purpose: Link an OAuth account to user.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: OAuthAccount
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def unlink_account(self, db: AsyncSession, user_id: UUID, provider: str) -> None:
        """
        Purpose: Unlink OAuth provider from user.
        Arguments:
            db: AsyncSession
            user_id: UUID
            provider: str
        Return Type: None
        Raises: None
        """
        query = delete(self.model).filter(
            self.model.user_id == user_id,
            self.model.provider == provider
        )
        await db.execute(query)
        await db.flush()

    async def get_provider(self, db: AsyncSession, provider: str, account_id: str) -> Optional[OAuthAccount]:
        """
        Purpose: Get account by provider and ID.
        Arguments:
            db: AsyncSession
            provider: str
            account_id: str
        Return Type: Optional[OAuthAccount]
        Raises: None
        """
        query = select(self.model).filter(
            self.model.provider == provider,
            self.model.provider_account_id == account_id
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def list_accounts(self, db: AsyncSession, user_id: UUID) -> List[OAuthAccount]:
        """
        Purpose: List OAuth accounts for user.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: List[OAuthAccount]
        Raises: None
        """
        query = select(self.model).filter(self.model.user_id == user_id)
        result = await db.execute(query)
        return list(result.scalars().all())

oauth_repository = OAuthRepository()

from app.Auth.models.oauth_provider_config import OAuthProviderConfig

class OAuthProviderConfigRepository(BaseRepository[OAuthProviderConfig, Any, Any]):
    def __init__(self):
        super().__init__(OAuthProviderConfig)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[OAuthProviderConfig]:
        query = select(self.model).filter(self.model.name == name)
        result = await db.execute(query)
        return result.scalars().first()

oauth_provider_config_repository = OAuthProviderConfigRepository()
