from typing import Protocol
from uuid import UUID

class AuditContract(Protocol):
    async def record_login(self, user_id: UUID, success: bool, ip_address: str, device_id: str) -> None:
        ...
        
    async def record_logout(self, user_id: UUID, session_id: UUID) -> None:
        ...
        
    async def record_password_change(self, user_id: UUID, success: bool) -> None:
        ...
        
    async def record_security_event(self, event_type: str, user_id: UUID, details: str) -> None:
        ...
