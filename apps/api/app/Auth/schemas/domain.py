from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

@dataclass
class AuthenticatedUser:
    id: UUID
    email: str
    roles: List[str] = field(default_factory=list)
    permissions: List[str] = field(default_factory=list)

@dataclass
class AuthenticationContext:
    user: AuthenticatedUser
    session_id: UUID
    device_id: Optional[str] = None
    mfa_verified: bool = False

@dataclass
class CurrentSession:
    id: UUID
    user_id: UUID
    expires_at: datetime
    is_active: bool

@dataclass
class TokenPair:
    access_token: str
    refresh_token: str
    expires_in: int

@dataclass
class DeviceContext:
    device_id: str
    ip_address: str
    user_agent: str

@dataclass
class LoginAttempt:
    email: str
    ip_address: str
    success: bool
    timestamp: datetime

@dataclass
class SecurityContext:
    actor_id: Optional[UUID] = None
    ip_address: Optional[str] = None

@dataclass
class PasswordChange:
    user_id: UUID
    success: bool
    reason: Optional[str] = None

@dataclass
class PasswordReset:
    user_id: UUID
    token: str

@dataclass
class EmailVerification:
    user_id: UUID
    token: str
    verified: bool = False
