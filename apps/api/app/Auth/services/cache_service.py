import json
import logging
from typing import Optional, Any
from uuid import UUID
from datetime import datetime, timezone

from app.Auth.core.redis import redis_manager

logger = logging.getLogger(__name__)

class CacheService:
    def __init__(self):
        self.fallback_cache = {}

    def _is_redis_available(self) -> bool:
        return redis_manager.client is not None

    async def get(self, key: str) -> Optional[Any]:
        if self._is_redis_available():
            try:
                client = redis_manager.get_client()
                val = await client.get(key)
                if val:
                    return json.loads(val)
            except Exception as e:
                logger.warning(f"Redis get failed (falling back to memory): {e}")
        
        # Fallback cache lookup
        item = self.fallback_cache.get(key)
        if item:
            val, expiry = item
            if expiry is None or datetime.now(timezone.utc).timestamp() < expiry:
                return val
            else:
                self.fallback_cache.pop(key, None)
        return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        serialized = json.dumps(value)
        if self._is_redis_available():
            try:
                client = redis_manager.get_client()
                if ttl:
                    await client.setex(key, ttl, serialized)
                else:
                    await client.set(key, serialized)
                return True
            except Exception as e:
                logger.warning(f"Redis set failed (falling back to memory): {e}")

        # Fallback cache storage
        expiry = datetime.now(timezone.utc).timestamp() + ttl if ttl else None
        self.fallback_cache[key] = (value, expiry)
        return True

    async def delete(self, key: str) -> bool:
        deleted = False
        if self._is_redis_available():
            try:
                client = redis_manager.get_client()
                await client.delete(key)
                deleted = True
            except Exception as e:
                logger.warning(f"Redis delete failed: {e}")
        
        if key in self.fallback_cache:
            self.fallback_cache.pop(key, None)
            deleted = True
        return deleted

    async def exists(self, key: str) -> bool:
        if self._is_redis_available():
            try:
                client = redis_manager.get_client()
                return await client.exists(key) > 0
            except Exception as e:
                logger.warning(f"Redis exists check failed: {e}")
        
        if key in self.fallback_cache:
            _, expiry = self.fallback_cache[key]
            if expiry is None or datetime.now(timezone.utc).timestamp() < expiry:
                return True
            self.fallback_cache.pop(key, None)
        return False

    # --- Concrete Use Cases ---

    async def get_user_permissions(self, user_id: UUID) -> Optional[list]:
        return await self.get(f"user_permissions:{user_id}")

    async def set_user_permissions(self, user_id: UUID, permissions: list) -> bool:
        return await self.set(f"user_permissions:{user_id}", permissions, ttl=900) # 15 min

    async def invalidate_user_permissions(self, user_id: UUID) -> bool:
        return await self.delete(f"user_permissions:{user_id}")

    async def get_organization(self, org_id: UUID) -> Optional[dict]:
        return await self.get(f"organization:{org_id}")

    async def set_organization(self, org_id: UUID, metadata: dict) -> bool:
        return await self.set(f"organization:{org_id}", metadata, ttl=1800) # 30 min

    async def invalidate_organization(self, org_id: UUID) -> bool:
        return await self.delete(f"organization:{org_id}")

    async def blacklist_token(self, jti: str, expires_in_seconds: int) -> bool:
        return await self.set(f"blacklist:{jti}", True, ttl=max(1, expires_in_seconds))

    async def is_token_blacklisted(self, jti: str) -> bool:
        return await self.exists(f"blacklist:{jti}")

cache_service = CacheService()
