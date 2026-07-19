from pydantic_settings import BaseSettings

class PasswordSettings(BaseSettings):
    history_length: int = 5
    reset_expiration_minutes: int = 60
    password_expiration_days: int = 90
    force_logout: bool = True
    notify_password_change: bool = True
    max_reset_requests: int = 5
    reset_cooldown: int = 2

    class Config:
        env_prefix = "PASSWORD_"

password_settings = PasswordSettings()
