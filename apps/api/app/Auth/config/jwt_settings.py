from pydantic_settings import BaseSettings
from typing import List

class JWTConfiguration(BaseSettings):
    jwt_secret_key: str = "default_jwt_secret_key_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_issuer: str = "rajauth"
    jwt_audience: str = "rajauth-users"
    jwt_access_expiration_minutes: int = 15
    jwt_refresh_expiration_days: int = 7
    jwt_verification_expiration_hours: int = 24
    jwt_password_reset_expiration_hours: int = 1
    jwt_clock_skew_seconds: int = 30
    jwt_token_prefix: str = "Bearer"

jwt_config = JWTConfiguration()
