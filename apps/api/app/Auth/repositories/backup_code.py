from typing import Any, List
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.backup_code import BackupCode
from app.Auth.repositories.base import BaseRepository

class BackupCodeRepository(BaseRepository[BackupCode, Any, Any]):
    def __init__(self):
        super().__init__(BackupCode)

    async def get_active_codes(self, db: AsyncSession, user_id: UUID) -> List[BackupCode]:
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.is_used == False
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def delete_by_user(self, db: AsyncSession, user_id: UUID) -> None:
        query = delete(self.model).filter(self.model.user_id == user_id)
        await db.execute(query)
        await db.flush()

backup_code_repository = BackupCodeRepository()