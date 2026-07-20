from typing import Any, List, Optional, Union

from pydantic import AnyHttpUrl, PostgresDsn, field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings, using pydantic-settings.
    """
    PROJECT_NAME: str = "RajAuth"
    API_V1_STR: str = "/api/v1"

    # Security Core
    SECRET_KEY: str = "default_unsafe_secret_key_change_in_production"
    ENCRYPTION_KEY: str = "w-T998d4Z2R2g3T-rL8p_K0zY8O9c3g3L-p8U2zX1K8="  # Example fernet key

    # Hashing Settings
    HASH_ALGORITHM: str = "argon2"
    ALLOW_BCRYPT_FALLBACK: bool = True
    ARGON2_MEMORY_COST: int = 65536
    ARGON2_TIME_COST: int = 3
    ARGON2_PARALLELISM: int = 4

    # Password Policy
    PASSWORD_MIN_LENGTH: int = 8
    PASSWORD_MAX_LENGTH: int = 128

    # Tokens & OTPs
    TOKEN_LENGTH: int = 32
    OTP_LENGTH: int = 6

    # Legacy JWT Settings (from before)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    # CORS
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "rajauth"
    POSTGRES_PORT: int = 5432
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    @field_validator("SQLALCHEMY_DATABASE_URI", mode="before")
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> Any:
        import os
        val = v or os.getenv("SQLALCHEMY_DATABASE_URI") or os.getenv("DATABASE_URL")
        if isinstance(val, str):
            if val.startswith("postgres://"):
                val = val.replace("postgres://", "postgresql+asyncpg://", 1)
            elif val.startswith("postgresql://"):
                val = val.replace("postgresql://", "postgresql+asyncpg://", 1)
            return val
        values = info.data
        user = values.get("POSTGRES_USER")
        password = values.get("POSTGRES_PASSWORD")
        host = values.get("POSTGRES_SERVER")
        port = values.get("POSTGRES_PORT")
        db = values.get("POSTGRES_DB") or ""
        return f"postgresql+asyncpg://{user}:{password}@{host}:{port}/{db}"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Sentry
    SENTRY_DSN: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

settings = Settings()
