from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.api.deps import get_db, get_email_service
from app.Auth.services.verify_email_service import VerifyEmailService
from app.Auth.services.resend_verification_service import ResendVerificationService
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.email_verification import EmailVerificationRepository
from app.Auth.security.jwt.manager import JWTManager

async def get_jwt_manager() -> JWTManager:
    return JWTManager()

async def get_user_repository() -> UserRepository:
    return UserRepository()

async def get_email_verification_repository() -> EmailVerificationRepository:
    return EmailVerificationRepository()

async def get_verify_email_service(
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    token_repo: EmailVerificationRepository = Depends(get_email_verification_repository),
    jwt: JWTManager = Depends(get_jwt_manager)
) -> VerifyEmailService:
    return VerifyEmailService(
        db=db,
        user_repo=user_repo,
        token_repo=token_repo,
        jwt_manager=jwt
    )

async def get_resend_verification_service(
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    token_repo: EmailVerificationRepository = Depends(get_email_verification_repository),
    jwt: JWTManager = Depends(get_jwt_manager),
    email_service = Depends(get_email_service)
) -> ResendVerificationService:
    return ResendVerificationService(
        db=db,
        user_repo=user_repo,
        token_repo=token_repo,
        jwt_manager=jwt,
        email_service=email_service
    )
