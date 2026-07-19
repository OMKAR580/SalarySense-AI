from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class TokenCreated:
    jti: str
    token_type: str
    subject: str
    timestamp: datetime

@dataclass
class TokenValidated:
    jti: str
    token_type: str
    timestamp: datetime

@dataclass
class TokenExpired:
    jti: Optional[str]
    timestamp: datetime

@dataclass
class RefreshRotationRequested:
    old_jti: str
    timestamp: datetime

@dataclass
class RefreshRotationCompleted:
    old_jti: str
    new_jti: str
    timestamp: datetime
