from pydantic_settings import BaseSettings

class AuthenticationConfiguration(BaseSettings):
    max_login_attempts: int = 5
    lockout_duration_minutes: int = 15
    require_email_verification: bool = True

class SessionConfiguration(BaseSettings):
    max_concurrent_sessions: int = 5
    session_idle_timeout_minutes: int = 60
    absolute_timeout_hours: int = 24

class PasswordConfiguration(BaseSettings):
    password_history_count: int = 3
    password_max_age_days: int = 90

class OAuthConfiguration(BaseSettings):
    allowed_providers: list[str] = ["google", "github", "apple"]
    auto_link_accounts: bool = False

class AuthConfig:
    authentication = AuthenticationConfiguration()
    session = SessionConfiguration()
    password = PasswordConfiguration()
    oauth = OAuthConfiguration()

auth_config = AuthConfig()
