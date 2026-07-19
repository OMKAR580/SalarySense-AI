from pydantic import BaseModel, EmailStr
from typing import List, Optional
from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    username: Optional[str] = None
    is_active: bool
    is_verified: bool

class PasswordPolicyResponse(BaseModel):
    min_length: int
    max_length: int
    require_uppercase: bool
    require_lowercase: bool
    require_number: bool
    require_special: bool
