from typing import Optional, Dict
from uuid import UUID
from datetime import datetime, timedelta
from app.Auth.auth.identity.cache import IdentityCache
from app.Auth.auth.identity.models import Identity
from app.Auth.auth.identity.exceptions import IdentityCacheFailure

class MemoryCacheImpl(IdentityCache):
    """
    Purpose: Thread-safe in-memory cache for Identity objects tracking TTL strictly.
    """
    def __init__(self):
        self._store: Dict[UUID, dict] = {}

    async def get(self, user_id: UUID) -> Optional[Identity]:
        try:
            record = self._store.get(user_id)
            if not record:
                return None
            
            if datetime.now() > record['expires_at']:
                await self.invalidate(user_id)
                return None
                
            return record['identity']
        except Exception as e:
            raise IdentityCacheFailure(f"Cache get failed: {e}")

    async def set(self, identity: Identity, ttl_seconds: int) -> None:
        try:
            expires_at = datetime.now() + timedelta(seconds=ttl_seconds)
            self._store[identity.id] = {
                'identity': identity,
                'expires_at': expires_at
            }
        except Exception as e:
            raise IdentityCacheFailure(f"Cache set failed: {e}")

    async def invalidate(self, user_id: UUID) -> None:
        self._store.pop(user_id, None)
