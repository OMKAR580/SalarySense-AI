from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, Dict, Any
from uuid import UUID

class RegisterRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    username: str = Field(..., min_length=3, max_length=50, description="Unique username")
    password: str = Field(..., min_length=8, description="Strong password")
    confirm_password: str = Field(..., description="Confirmation of the password")
    first_name: Optional[str] = Field(None, max_length=50)
    last_name: Optional[str] = Field(None, max_length=50)
    phone: Optional[str] = Field(None, max_length=20)
    accept_terms: bool = Field(..., description="Must accept terms and conditions")
    organization_code: Optional[str] = Field(None)
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict)
    oauth_provider: Optional[str] = Field(None, description="OAuth provider name if registering via OAuth")
    oauth_provider_account_id: Optional[str] = Field(None, description="OAuth provider account ID if registering via OAuth")

    @validator('confirm_password')
    def passwords_match(cls, v, values, **kwargs):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
        
    @validator('accept_terms')
    def terms_accepted(cls, v):
        if not v:
            raise ValueError('Terms must be accepted')
        return v

class RegisterResponse(BaseModel):
    user_id: UUID
    email: str
    username: str
    status: str
    verification_required: bool
    verification_token_sent: bool
    message: str


class VerifyEmailRequest(BaseModel):
    token: str = Field(..., description="JWT verification token")


class ResendVerificationRequest(BaseModel):
    email: EmailStr = Field(..., description="Email to resend verification link to")

