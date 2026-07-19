from enum import Enum
from pydantic import BaseModel

class RecoveryEventType(str, Enum):
    EMAIL_VERIFICATION_REQUESTED = "EmailVerificationRequested"
    EMAIL_VERIFIED = "EmailVerified"
    VERIFICATION_RESENT = "VerificationResent"
    PASSWORD_RESET_REQUESTED = "PasswordResetRequested"
    PASSWORD_RESET_COMPLETED = "PasswordResetCompleted"
    PASSWORD_CHANGED = "PasswordChanged"
    PASSWORD_EXPIRED = "PasswordExpired"

class RecoveryEvent(BaseModel):
    event_type: RecoveryEventType
    user_id: str
    metadata: dict = {}
