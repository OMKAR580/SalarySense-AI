from dataclasses import dataclass
from uuid import UUID
from datetime import datetime
from typing import Optional

@dataclass
class UserLoggedIn:
    user_id: UUID
    session_id: UUID
    ip_address: Optional[str]
    timestamp: datetime

@dataclass
class UserLoggedOut:
    user_id: UUID
    session_id: UUID
    timestamp: datetime

@dataclass
class TokenRefreshed:
    user_id: UUID
    session_id: UUID
    timestamp: datetime

@dataclass
class SessionCreated:
    session_id: UUID
    user_id: UUID
    timestamp: datetime

@dataclass
class SessionExpired:
    session_id: UUID
    timestamp: datetime
