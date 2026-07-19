from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class LoginRequest(BaseModel):
    identifier: str
    password: str
    device_name: Optional[str] = None
    remember_me: bool = False
    device_identifier: Optional[str] = None

class SessionResponse(BaseModel):
    session_id: UUID
    ip_address: Optional[str]
    device_name: Optional[str]
    created_at: datetime
    last_active: datetime

class LoginResponse(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "Bearer"
    expires_in: Optional[int] = None
    session: Optional[SessionResponse] = None
    user_id: UUID
    mfa_required: bool = False
    challenge_id: Optional[str] = None
    # Identity fields — returned so the frontend can personalize the UI
    # without a separate GET /auth/me call on every login.
    email: Optional[str] = None
    username: Optional[str] = None
    avatar: Optional[str] = None

class RefreshRequest(BaseModel):
    refresh_token: str

class LogoutRequest(BaseModel):
    refresh_token: Optional[str] = None
    all_devices: bool = False

class CurrentUserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    avatar: Optional[str] = None
    roles: List[str]
    permissions: List[str]
