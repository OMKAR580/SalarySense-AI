from pydantic_settings import BaseSettings

class VerificationSettings(BaseSettings):
    VERIFICATION_TOKEN_LIFETIME_MINUTES: int = 1440 # 24 hours
    RESEND_COOLDOWN_MINUTES: int = 2
    MAX_RESEND_ATTEMPTS: int = 5
    VERIFICATION_REDIRECT_URL: str = "https://example.com/verify-success"
    ISSUER: str = "RajAuth"

    class Config:
        env_prefix = "VERIFY_"

verification_settings = VerificationSettings()
