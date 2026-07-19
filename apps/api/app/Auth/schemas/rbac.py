from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    is_system: Optional[bool] = False

class RoleUpdate(BaseModel):
    description: Optional[str] = None

class RoleResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    is_system: bool

    class Config:
        from_attributes = True

class PermissionCreate(BaseModel):
    resource: str
    action: str
    description: Optional[str] = None

class PermissionResponse(BaseModel):
    id: UUID
    resource: str
    action: str
    description: Optional[str] = None

    class Config:
        from_attributes = True

class RoleAssignmentRequest(BaseModel):
    role_id: UUID
    expires_at: Optional[datetime] = None
