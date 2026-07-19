from typing import Any, List
from uuid import UUID
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.audit_log import AuditLog
from app.Auth.repositories.base import BaseRepository

class AuditLogRepository(BaseRepository[AuditLog, Any, Any]):
    def __init__(self):
        super().__init__(AuditLog)

    async def write_log(self, db: AsyncSession, data: dict) -> AuditLog:
        """
        Purpose: Write an audit log entry.
        Arguments:
            db: AsyncSession
            data: dict
        Return Type: AuditLog
        Raises: None
        """
        return await self.create(db, obj_in=data)

    async def search_logs(self, db: AsyncSession, **kwargs) -> List[AuditLog]:
        """
        Purpose: Search audit logs.
        Arguments:
            db: AsyncSession
            kwargs: dict - filters
        Return Type: List[AuditLog]
        Raises: None
        """
        return await self.search(db, **kwargs)

    async def list_user_logs(self, db: AsyncSession, user_id: UUID) -> List[AuditLog]:
        """
        Purpose: List audit logs for actor.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: List[AuditLog]
        Raises: None
        """
        query = select(self.model).filter(self.model.actor_id == user_id).order_by(self.model.created_at.desc())
        result = await db.execute(query)
        return list(result.scalars().all())

audit_log_repository = AuditLogRepository()
audit_repository = audit_log_repository
