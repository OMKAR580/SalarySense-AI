from dataclasses import dataclass, field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

@dataclass
class JWTHeader:
    alg: str
    typ: str
    kid: Optional[str] = None
    cty: Optional[str] = None
    x5t: Optional[str] = None
    crit: Optional[List[str]] = None

@dataclass
class HeaderMetadata:
    header: JWTHeader
    raw: Dict[str, Any]

@dataclass
class JWTClaims:
    sub: str
    iss: str
    aud: str
    iat: int
    exp: int
    nbf: Optional[int] = None
    jti: Optional[str] = None
    typ: str = "access"
    
    # Custom/Enterprise Claims
    user_id: Optional[str] = None
    email: Optional[str] = None
    username: Optional[str] = None
    roles: List[str] = field(default_factory=list)
    permissions: List[str] = field(default_factory=list)
    organization_id: Optional[str] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None
    ver: Optional[str] = None
    scope: Optional[str] = None
    nonce: Optional[str] = None
    trace_id: Optional[str] = None
    request_id: Optional[str] = None
    tenant_id: Optional[str] = None
    client_id: Optional[str] = None
    auth_method: Optional[str] = None
    auth_level: Optional[str] = None
    device_trust: Optional[str] = None
    risk_score: Optional[int] = None
    token_family: Optional[str] = None
    rotation_counter: Optional[int] = None
    mfa_verified: Optional[bool] = False
    authentication_method: Optional[str] = None
    authentication_level: Optional[int] = None
    trusted_device: Optional[bool] = False
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class TokenMetadata:
    token: str
    token_type: str
    expires_in: int
    expires_at: datetime
    jti: str

@dataclass
class DecodedToken:
    header: Dict[str, Any]
    payload: Dict[str, Any]
    claims: JWTClaims

@dataclass
class TokenValidationResult:
    is_valid: bool
    claims: Optional[JWTClaims] = None
    error: Optional[str] = None

@dataclass
class TokenPair:
    access_token: TokenMetadata
    refresh_token: TokenMetadata

@dataclass
class TokenDescriptor:
    type: str
    description: str

@dataclass
class TokenIdentity:
    subject: str
    roles: List[str]

@dataclass
class TokenContext:
    ip: str
    user_agent: str

@dataclass
class TokenFingerprint:
    hash: str

@dataclass
class TokenStatistics:
    use_count: int
    last_used: datetime
