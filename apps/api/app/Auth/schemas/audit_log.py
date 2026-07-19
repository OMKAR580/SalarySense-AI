from pydantic import BaseModel
from typing import Optional, Any
from uuid import UUID
from datetime import datetime

class AdminAuditLogResponse(BaseModel):
    id: UUID
    actor_id: Optional[UUID] = None
    target_id: Optional[UUID] = None
    action: str
    entity: str
    changes: Optional[Any] = None
    ip_address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
