from enum import Enum


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"


class OAuthProvider(str, Enum):
    GOOGLE = "google"
    GITHUB = "github"
    FACEBOOK = "facebook"
    APPLE = "apple"


class TokenType(str, Enum):
    REFRESH = "refresh"
    RESET_PASSWORD = "reset_password"
    EMAIL_VERIFICATION = "email_verification"


class SessionStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    EXPIRED = "expired"


class DeviceType(str, Enum):
    DESKTOP = "desktop"
    MOBILE = "mobile"
    TABLET = "tablet"
    UNKNOWN = "unknown"


class AuditAction(str, Enum):
    LOGIN = "login"
    LOGOUT = "logout"
    PASSWORD_CHANGE = "password_change"
    EMAIL_CHANGE = "email_change"
    ROLE_CHANGE = "role_change"
    PERMISSION_CHANGE = "permission_change"
    TWO_FACTOR_ENABLE = "two_factor_enable"
    TWO_FACTOR_DISABLE = "two_factor_disable"
    API_KEY_CREATE = "api_key_create"


class LoginStatus(str, Enum):
    SUCCESS = "success"
    FAILED = "failed"
