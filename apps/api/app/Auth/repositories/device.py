from typing import Any, Optional
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.device import Device
from app.Auth.repositories.base import BaseRepository

class DeviceRepository(BaseRepository[Device, Any, Any]):
    def __init__(self):
        super().__init__(Device)

    async def register_device(self, db: AsyncSession, data: dict) -> Device:
        """
        Purpose: Register a new device.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: Device
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def find_device(self, db: AsyncSession, device_identifier: str) -> Optional[Device]:
        """
        Purpose: Find a device by its identifier.
        Arguments:
            db: AsyncSession
            device_identifier: str
        Return Type: Optional[Device]
        Raises: None
        """
        query = select(self.model).filter(self.model.device_identifier == device_identifier)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_user_and_identifier(self, db: AsyncSession, user_id: UUID, device_identifier: str) -> Optional[Device]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.device_identifier == device_identifier
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def trust_device(self, db: AsyncSession, id: UUID) -> Optional[Device]:
        """
        Purpose: Trust a device.
        Arguments:
            db: AsyncSession
            id: UUID
        Return Type: Optional[Device]
        Raises: None
        """
        dev = await self.get_by_id(db, id)
        if dev:
            dev.is_trusted = True
            db.add(dev)
            await db.flush()
        return dev

    async def remove_device(self, db: AsyncSession, id: UUID) -> None:
        """
        Purpose: Remove a device.
        Arguments:
            db: AsyncSession
            id: UUID
        Return Type: None
        Raises: None
        """
        await self.delete(db, id=id)

device_repository = DeviceRepository()
