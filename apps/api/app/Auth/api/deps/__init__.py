from fastapi import Depends
from app.Auth.database.session import get_db_session

get_db = get_db_session
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.session import SessionRepository
from app.Auth.repositories.refresh_token import RefreshTokenRepository
from app.Auth.repositories.password_reset import PasswordResetRepository
from app.Auth.repositories.email_verification import EmailVerificationRepository
from app.Auth.repositories.oauth import OAuthRepository
from app.Auth.repositories.organization import OrganizationRepository

from app.Auth.services.user_service import UserService
from app.Auth.services.auth_service import AuthService
from app.Auth.services.session_service import SessionService
from app.Auth.services.token_service import TokenService
from app.Auth.services.password_service import PasswordService
from app.Auth.services.email_service import EmailService
from app.Auth.services.oauth_service import OAuthService
from app.Auth.services.verification_service import VerificationService
from app.Auth.services.organization_service import OrganizationService

# --- Repository Providers ---
def get_user_repository() -> UserRepository:
    return UserRepository()

def get_session_repository() -> SessionRepository:
    return SessionRepository()

def get_refresh_token_repository() -> RefreshTokenRepository:
    return RefreshTokenRepository()

def get_password_reset_repository() -> PasswordResetRepository:
    return PasswordResetRepository()

def get_email_verification_repository() -> EmailVerificationRepository:
    return EmailVerificationRepository()

def get_oauth_repository() -> OAuthRepository:
    return OAuthRepository()

def get_organization_repository() -> OrganizationRepository:
    return OrganizationRepository()


# --- Service Providers ---
def get_user_service(
    repo: UserRepository = Depends(get_user_repository)
) -> UserService:
    return UserService(repo)

def get_session_service(
    repo: SessionRepository = Depends(get_session_repository)
) -> SessionService:
    return SessionService(repo)

def get_token_service(
    repo: RefreshTokenRepository = Depends(get_refresh_token_repository)
) -> TokenService:
    return TokenService(repo)

def get_password_service(
    repo: PasswordResetRepository = Depends(get_password_reset_repository),
    user_service: UserService = Depends(get_user_service)
) -> PasswordService:
    return PasswordService(repo, user_service)

import os
from app.Auth.services.email_service import EmailService, DummyEmailService, SMTPEmailService
from dotenv import load_dotenv

def get_email_service() -> EmailService:
    # Load .env variables so os.getenv can detect them
    # Ensure this looks for .env in the right path, default is current directory but we can explicitly load if needed
    load_dotenv()
    if os.getenv("RESEND_API_KEY"):
        from app.Auth.services.email_service import ResendEmailService
        return ResendEmailService()
    if os.getenv("SMTP_HOST"):
        return SMTPEmailService()
    return DummyEmailService()

def get_oauth_service(
    repo: OAuthRepository = Depends(get_oauth_repository),
    user_service: UserService = Depends(get_user_service)
) -> OAuthService:
    return OAuthService(repo, user_service)

def get_verification_service(
    repo: EmailVerificationRepository = Depends(get_email_verification_repository),
    user_service: UserService = Depends(get_user_service)
) -> VerificationService:
    return VerificationService(repo, user_service)

def get_organization_service(
    repo: OrganizationRepository = Depends(get_organization_repository)
) -> OrganizationService:
    return OrganizationService(repo)

def get_auth_service(
    user_service: UserService = Depends(get_user_service),
    token_service: TokenService = Depends(get_token_service),
    session_service: SessionService = Depends(get_session_service)
) -> AuthService:
    return AuthService(user_service, token_service, session_service)
