from typing import Dict, List, Optional, Any
from uuid import UUID
from datetime import datetime, timezone, timedelta

class PermissionCache:
    def __init__(self, ttl_seconds: int = 300):
        # Maps user_id -> {"permissions": List[str], "expires_at": datetime}
        self._cache: Dict[UUID, Dict[str, Any]] = {}
        self.ttl = ttl_seconds

    def get_permissions(self, user_id: UUID) -> Optional[List[str]]:
        entry = self._cache.get(user_id)
        if not entry:
            return None
        if datetime.now(timezone.utc) > entry["expires_at"]:
            self.invalidate(user_id)
            return None
        return entry["permissions"]

    def set_permissions(self, user_id: UUID, permissions: List[str]) -> None:
        self._cache[user_id] = {
            "permissions": permissions,
            "expires_at": datetime.now(timezone.utc) + timedelta(seconds=self.ttl)
        }

    def invalidate(self, user_id: UUID) -> None:
        if user_id in self._cache:
            del self._cache[user_id]

    def clear(self) -> None:
        self._cache.clear()

permission_cache = PermissionCache()
