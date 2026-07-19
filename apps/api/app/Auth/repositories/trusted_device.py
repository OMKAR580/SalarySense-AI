from typing import Any, List, Optional
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.trusted_device import TrustedDevice
from app.Auth.repositories.base import BaseRepository

class TrustedDeviceRepository(BaseRepository[TrustedDevice, Any, Any]):
    def __init__(self):
        super().__init__(TrustedDevice)

    async def get_by_user(self, db: AsyncSession, user_id: UUID) -> List[TrustedDevice]:
        query = select(self.model).filter(self.model.user_id == user_id)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_by_user_and_device(self, db: AsyncSession, user_id: UUID, device_id: UUID) -> Optional[TrustedDevice]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.device_id == device_id
        )
        result = await db.execute(query)
        return result.scalars().first()

trusted_device_repository = TrustedDeviceRepository()