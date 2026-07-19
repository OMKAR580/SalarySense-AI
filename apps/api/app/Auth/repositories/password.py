from typing import List, Optional, Any
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.system_setting import SystemSetting
from app.Auth.repositories.base import BaseRepository

class PasswordRepository(BaseRepository[SystemSetting, Any, Any]):
    def __init__(self):
        super().__init__(SystemSetting)

    def _get_key(self, user_id: UUID) -> str:
        return f"pwd_history_{user_id}"

    async def get_history(self, db: AsyncSession, user_id: UUID) -> List[str]:
        """
        Purpose: Retrieve password hash history list for a user.
        """
        key = self._get_key(user_id)
        query = select(self.model).filter(self.model.key == key)
        result = await db.execute(query)
        setting = result.scalars().first()
        if setting:
            return setting.value or []
        return []

    async def add_to_history(self, db: AsyncSession, user_id: UUID, password_hash: str, max_length: int) -> None:
        """
        Purpose: Add a new password hash to user's history and trim to max_length.
        """
        key = self._get_key(user_id)
        query = select(self.model).filter(self.model.key == key)
        result = await db.execute(query)
        setting = result.scalars().first()

        if setting:
            history = setting.value or []
            if not isinstance(history, list):
                history = []
            history.insert(0, password_hash)
            setting.value = history[:max_length]
            db.add(setting)
        else:
            setting_data = {
                "key": key,
                "value": [password_hash],
                "description": f"Password history for user {user_id}",
                "is_active": True
            }
            await self.create(db, obj_in=setting_data)

        await db.flush()

    async def clear_history(self, db: AsyncSession, user_id: UUID) -> None:
        """
        Purpose: Clear password history for a user.
        """
        key = self._get_key(user_id)
        query = delete(self.model).filter(self.model.key == key)
        await db.execute(query)
        await db.flush()

password_repository = PasswordRepository()
