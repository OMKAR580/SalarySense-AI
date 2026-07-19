from typing import Protocol, Optional
from uuid import UUID
from app.Auth.auth.identity.models import Identity

class IdentityCache(Protocol):
    async def get(self, user_id: UUID) -> Optional[Identity]: ...
    async def set(self, identity: Identity, ttl_seconds: int) -> None: ...
    async def invalidate(self, user_id: UUID) -> None: ...

class MemoryCache(IdentityCache):
    pass

class RedisCache(IdentityCache):
    pass

class DistributedCache(IdentityCache):
    pass
