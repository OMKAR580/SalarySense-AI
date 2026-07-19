from dataclasses import dataclass
from datetime import datetime
from uuid import UUID
from typing import Optional

@dataclass
class UserRegistered:
    user_id: UUID
    email: str
    timestamp: datetime

@dataclass
class VerificationTokenCreated:
    user_id: UUID
    timestamp: datetime

@dataclass
class VerificationEmailQueued:
    user_id: UUID
    email: str
    timestamp: datetime

@dataclass
class DefaultRoleAssigned:
    user_id: UUID
    role_name: str
    timestamp: datetime

@dataclass
class RegistrationCompleted:
    user_id: UUID
    timestamp: datetime
