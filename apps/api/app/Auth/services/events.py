from typing import Protocol, Any
from uuid import UUID
from datetime import datetime
from dataclasses import dataclass

@dataclass
class UserRegistered:
    user_id: UUID
    email: str
    timestamp: datetime

@dataclass
class UserLoggedIn:
    user_id: UUID
    session_id: UUID
    device_id: str
    timestamp: datetime

@dataclass
class UserLoggedOut:
    user_id: UUID
    session_id: UUID
    timestamp: datetime

@dataclass
class PasswordChanged:
    user_id: UUID
    timestamp: datetime

@dataclass
class PasswordResetRequested:
    user_id: UUID
    email: str
    timestamp: datetime

@dataclass
class PasswordResetCompleted:
    user_id: UUID
    timestamp: datetime

@dataclass
class EmailVerified:
    user_id: UUID
    timestamp: datetime

@dataclass
class SessionCreated:
    session_id: UUID
    user_id: UUID
    timestamp: datetime

@dataclass
class SessionRevoked:
    session_id: UUID
    user_id: UUID
    timestamp: datetime

@dataclass
class OAuthLinked:
    user_id: UUID
    provider: str
    timestamp: datetime


@dataclass
class PasswordExpired:
    user_id: UUID
    timestamp: datetime


@dataclass
class PasswordHistoryViolation:
    user_id: UUID
    timestamp: datetime


@dataclass
class MFAEnabled:
    user_id: UUID
    method_type: str
    timestamp: datetime


@dataclass
class MFADisabled:
    user_id: UUID
    timestamp: datetime


@dataclass
class MFAVerified:
    user_id: UUID
    method_type: str
    timestamp: datetime


@dataclass
class ChallengeCreated:
    user_id: UUID
    challenge_id: UUID
    method_type: str
    timestamp: datetime


@dataclass
class ChallengeCompleted:
    user_id: UUID
    challenge_id: UUID
    timestamp: datetime


@dataclass
class BackupCodesGenerated:
    user_id: UUID
    timestamp: datetime


@dataclass
class TrustedDeviceAdded:
    user_id: UUID
    device_id: UUID
    timestamp: datetime


@dataclass
class TrustedDeviceRemoved:
    user_id: UUID
    device_id: UUID
    timestamp: datetime


