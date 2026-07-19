from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID

# Requests
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    device_id: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    session_id: Optional[UUID] = None
    all_sessions: bool = False

class VerifyEmailRequest(BaseModel):
    token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class OAuthLoginRequest(BaseModel):
    provider: str
    provider_token: str

class CreateSessionRequest(BaseModel):
    user_id: UUID
    device_id: Optional[str] = None
    ip_address: Optional[str] = None

class DeviceRegistrationRequest(BaseModel):
    device_name: str
    device_id: str


# Responses
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "Bearer"
    expires_in: int

class LoginResponse(BaseModel):
    user_id: UUID
    tokens: TokenResponse
    mfa_required: bool = False

class SessionResponse(BaseModel):
    session_id: UUID
    device_name: Optional[str] = None
    last_active: str
    is_current: bool = False

class VerificationResponse(BaseModel):
    success: bool
    message: str

class OAuthResponse(BaseModel):
    user_id: UUID
    tokens: TokenResponse
    is_new_user: bool

class ErrorResponse(BaseModel):
    detail: str
    code: str

class HealthResponse(BaseModel):
    status: str
