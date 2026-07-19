from pydantic_settings import BaseSettings

class LoginConfiguration(BaseSettings):
    session_timeout_minutes: int = 60
    refresh_lifetime_days: int = 7
    concurrent_session_limits: int = 5
    max_failed_attempts: int = 5
    remember_me_duration_days: int = 30

login_config = LoginConfiguration()
