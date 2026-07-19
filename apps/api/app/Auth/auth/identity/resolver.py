from typing import Protocol, Optional
from uuid import UUID
from app.Auth.auth.identity.models import Identity

class IdentityResolver(Protocol):
    """
    Purpose: Abstract protocol defining how identities are fetched from the underlying storage.
    """
    async def resolve_by_email(self, email: str) -> Optional[Identity]:
        ...
        
    async def resolve_by_username(self, username: str) -> Optional[Identity]:
        ...
        
    async def resolve_by_phone(self, phone: str) -> Optional[Identity]:
        ...
        
    async def resolve_by_provider(self, provider: str, provider_subject: str) -> Optional[Identity]:
        ...
        
    async def resolve_by_user_id(self, user_id: UUID) -> Optional[Identity]:
        ...
        
    async def resolve(self, identifier: str) -> Optional[Identity]:
        """Smart resolution routing (e.g., auto-detect email vs username vs phone)."""
        ...
