from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
from uuid import UUID
from datetime import datetime

class AdminUserListResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AdminUserDetailResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: Optional[str] = None
    is_active: bool
    is_verified: bool
    created_at: datetime
    roles: List[Any] = []
    permissions: List[str] = []
    organizations: List[Any] = []

    class Config:
        from_attributes = True

class AdminUserPatchRequest(BaseModel):
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    role_ids: Optional[List[UUID]] = None
    metadata: Optional[dict] = None
