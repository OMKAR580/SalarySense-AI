from pydantic import BaseModel, EmailStr
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class OrganizationCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class OrganizationResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: Optional[str] = None
    owner_id: Optional[UUID] = None
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class OrganizationMemberResponse(BaseModel):
    id: UUID
    organization_id: UUID
    user_id: UUID
    role_id: Optional[UUID] = None
    invited_by: Optional[UUID] = None
    status: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class MemberInviteRequest(BaseModel):
    email: EmailStr
    role_id: Optional[UUID] = None

class MemberRoleChangeRequest(BaseModel):
    role_id: UUID
