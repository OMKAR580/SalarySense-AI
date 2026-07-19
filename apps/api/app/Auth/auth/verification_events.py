from enum import Enum
from pydantic import BaseModel
from typing import Dict, Any

class VerificationEventType(str, Enum):
    EMAIL_VERIFICATION_REQUESTED = "EmailVerificationRequested"
    EMAIL_VERIFIED = "EmailVerified"
    VERIFICATION_RESENT = "VerificationResent"

class VerificationEvent(BaseModel):
    event_type: VerificationEventType
    user_id: str
    metadata: Dict[str, Any] = {}
