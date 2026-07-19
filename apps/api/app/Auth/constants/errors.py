from enum import Enum

class ErrorCode(str, Enum):
    """Enumeration of standard authentication error codes."""
    INVALID_CREDENTIALS = "AUTH_001"
    TOKEN_EXPIRED = "AUTH_002"
    ACCOUNT_LOCKED = "AUTH_003"
    INSUFFICIENT_PERMISSIONS = "AUTH_004"
