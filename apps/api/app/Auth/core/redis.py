import logging
from typing import Optional
import redis.asyncio as aioredis

logger = logging.getLogger(__name__)

class RedisConnectionManager:
    def __init__(self):
        self.pool: Optional[aioredis.ConnectionPool] = None
        self.client: Optional[aioredis.Redis] = None

    def init_pool(self, redis_url: str) -> None:
        try:
            self.pool = aioredis.ConnectionPool.from_url(
                redis_url, 
                encoding="utf-8", 
                decode_responses=True
            )
            self.client = aioredis.Redis(connection_pool=self.pool)
            logger.info("Redis connection pool initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Redis connection pool: {e}")
            raise e

    def get_client(self) -> aioredis.Redis:
        if self.client is None:
            raise RuntimeError("Redis connection pool is not initialized.")
        return self.client

    async def ping(self) -> bool:
        if self.client is None:
            return False
        try:
            return await self.client.ping()
        except Exception as e:
            logger.error(f"Redis ping failed: {e}")
            return False

    async def close(self) -> None:
        if self.pool:
            await self.pool.disconnect()
            logger.info("Redis connection pool disconnected.")

redis_manager = RedisConnectionManager()
