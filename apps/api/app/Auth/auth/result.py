from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

@dataclass
class AuthenticationMetadata:
    provider: str
    timestamp: datetime
    auth_level: str
    is_new_device: bool

@dataclass
class AuthenticationStatistics:
    evaluation_time_ms: int
    risk_score: Optional[int] = None

@dataclass
class AuthenticationDecision:
    granted: bool
    reason: Optional[str] = None

@dataclass
class AuthenticationSuccess:
    user_id: UUID
    session_id: UUID
    metadata: AuthenticationMetadata

@dataclass
class AuthenticationFailure:
    reason: str
    code: str
    attempts_remaining: Optional[int] = None

@dataclass
class AuthenticationChallenge:
    challenge_type: str
    challenge_id: str
    parameters: Dict[str, Any] = field(default_factory=dict)

@dataclass
class AuthenticationResult:
    """
    Purpose: Unified result model for all authentication flows.
    Architecture Notes: Completely decoupled from HTTP responses.
    """
    decision: AuthenticationDecision
    stats: AuthenticationStatistics
    success: Optional[AuthenticationSuccess] = None
    failure: Optional[AuthenticationFailure] = None
    challenge: Optional[AuthenticationChallenge] = None
    warnings: List[str] = field(default_factory=list)
