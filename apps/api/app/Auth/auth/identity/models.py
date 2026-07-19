from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime
from app.Auth.auth.identity.states import IdentityStatus

@dataclass(frozen=True)
class IdentityRole:
    name: str
    description: Optional[str] = None
    is_system: bool = False

@dataclass(frozen=True)
class IdentityPermission:
    name: str
    resource: str
    action: str

@dataclass(frozen=True)
class IdentityOrganization:
    organization_id: UUID
    role: str
    is_active: bool

@dataclass(frozen=True)
class IdentityProfile:
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    avatar_url: Optional[str] = None
    locale: Optional[str] = None
    timezone: Optional[str] = None

@dataclass(frozen=True)
class IdentitySecurity:
    password_hash: Optional[str] = None
    mfa_enabled: bool = False
    mfa_methods: List[str] = field(default_factory=list)
    failed_login_attempts: int = 0
    last_password_change: Optional[datetime] = None

@dataclass(frozen=True)
class IdentityMetadata:
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None
    custom_attributes: Dict[str, Any] = field(default_factory=dict)

@dataclass(frozen=True)
class IdentityPreferences:
    email_notifications: bool = True
    sms_notifications: bool = False
    marketing_opt_in: bool = False

@dataclass(frozen=True)
class Identity:
    """
    Purpose: Canonical representation of a user identity, agnostic to the authentication provider.
    Architecture Notes: Frozen (immutable) to ensure integrity throughout the authentication lifecycle.
    """
    id: UUID
    email: str
    status: IdentityStatus
    username: Optional[str] = None
    phone: Optional[str] = None
    profile: IdentityProfile = field(default_factory=IdentityProfile)
    security: IdentitySecurity = field(default_factory=IdentitySecurity)
    metadata: IdentityMetadata = field(default_factory=lambda: IdentityMetadata(datetime.now(), datetime.now()))
    preferences: IdentityPreferences = field(default_factory=IdentityPreferences)
    organizations: List[IdentityOrganization] = field(default_factory=list)
    roles: List[IdentityRole] = field(default_factory=list)
    permissions: List[IdentityPermission] = field(default_factory=list)
