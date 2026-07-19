from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class TokenIssued:
    token_type: str
    jti: str
    subject: str
    timestamp: datetime

@dataclass
class TokenRevoked:
    jti: str
    reason: str
    timestamp: datetime

@dataclass
class TokenRotated:
    old_jti: str
    new_jti: str
    timestamp: datetime

@dataclass
class TokenBlacklisted:
    jti: str
    timestamp: datetime

@dataclass
class TokenWhitelisted:
    jti: str
    timestamp: datetime

@dataclass
class SessionBound:
    jti: str
    session_id: str
    timestamp: datetime

@dataclass
class SessionUnbound:
    jti: str
    session_id: str
    timestamp: datetime

@dataclass
class KeyRotated:
    kid: str
    algorithm: str
    timestamp: datetime

@dataclass
class ProviderChanged:
    token_type: str
    new_provider: str
    timestamp: datetime
