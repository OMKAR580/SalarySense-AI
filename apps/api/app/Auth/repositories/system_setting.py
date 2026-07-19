from typing import Any, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.system_setting import SystemSetting
from app.Auth.repositories.base import BaseRepository

class SystemSettingRepository(BaseRepository[SystemSetting, Any, Any]):
    def __init__(self):
        super().__init__(SystemSetting)

    async def get_by_key(self, db: AsyncSession, key: str) -> Optional[SystemSetting]:
        query = select(self.model).filter(self.model.key == key)
        result = await db.execute(query)
        return result.scalars().first()

system_setting_repository = SystemSettingRepository()