from datetime import datetime, timezone, timedelta
from typing import Any, List, Optional
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.models.session import Session
from app.Auth.repositories.base import BaseRepository

class SessionRepository(BaseRepository[Session, Any, Any]):
    def __init__(self):
        super().__init__(Session)

    async def create_session(self, db: AsyncSession, session_data: dict) -> Session:
        """
        Purpose: Create a new session (backward compatibility).
        """
        return await self.create(db, obj_in=session_data)

    async def create_session_record(
        self,
        db: AsyncSession,
        user_id: UUID,
        session_id: UUID,
        device_id: Optional[UUID] = None,
        duration_minutes: int = 1440
    ) -> Session:
        """
        Standardized method to create and persist a Session.
        Ensures device_id is optional and handles token hashing and expiration consistently.
        """
        import hashlib
        session_token_hash = hashlib.sha256(str(session_id).encode("utf-8")).hexdigest()
        
        session_data = {
            "id": session_id,
            "user_id": user_id,
            "device_id": device_id,
            "session_token_hash": session_token_hash,
            "expires_at": datetime.now(timezone.utc) + timedelta(minutes=duration_minutes),
            "is_revoked": False
        }
        return await self.create(db, obj_in=session_data)

    async def get_session(self, db: AsyncSession, session_id: UUID) -> Optional[Session]:
        """
        Purpose: Get a session by ID.
        Arguments:
            db: AsyncSession
            session_id: UUID
        Return Type: Optional[Session]
        Raises: None
        """
        return await self.get_by_id(db, session_id)

    async def get_active_sessions(self, db: AsyncSession, user_id: UUID) -> List[Session]:
        """
        Purpose: Get all active sessions for a user.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: List[Session]
        Raises: None
        """
        query = select(self.model).filter(
            self.model.user_id == user_id,
            self.model.is_revoked == False,
            self.model.expires_at > datetime.now(timezone.utc)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def revoke_session(self, db: AsyncSession, session_id: UUID) -> Optional[Session]:
        """
        Purpose: Revoke a specific session.
        Arguments:
            db: AsyncSession
            session_id: UUID
        Return Type: Optional[Session]
        Raises: None
        """
        session = await self.get_by_id(db, session_id)
        if session:
            session.is_revoked = True
            db.add(session)
            await db.flush()
        return session

    async def revoke_all_sessions(self, db: AsyncSession, user_id: UUID) -> None:
        """
        Purpose: Revoke all active sessions for a user.
        Arguments:
            db: AsyncSession
            user_id: UUID
        Return Type: None
        Raises: None
        """
        sessions = await self.get_active_sessions(db, user_id)
        for session in sessions:
            session.is_revoked = True
            db.add(session)
        await db.flush()

    async def delete_expired_sessions(self, db: AsyncSession) -> None:
        """
        Purpose: Delete completely expired sessions from DB.
        Arguments:
            db: AsyncSession
        Return Type: None
        Raises: None
        """
        query = delete(self.model).filter(self.model.expires_at <= datetime.now(timezone.utc))
        await db.execute(query)
        await db.flush()

session_repository = SessionRepository()
