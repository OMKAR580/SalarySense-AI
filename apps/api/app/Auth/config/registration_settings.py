from pydantic_settings import BaseSettings

class RegistrationConfiguration(BaseSettings):
    allow_registration: bool = True
    require_email_verification: bool = True
    default_role: str = "User"
    minimum_password_score: int = 3
    auto_login_after_registration: bool = False

registration_config = RegistrationConfiguration()
