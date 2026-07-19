from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.api.deps import get_db, get_email_service
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.password_reset import PasswordResetRepository
from app.Auth.repositories.session import SessionRepository
from app.Auth.repositories.refresh_token import RefreshTokenRepository
from app.Auth.repositories.password import PasswordRepository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.security.password import PasswordHasher
from app.Auth.security.policy import PasswordPolicy
from app.Auth.services.password_history_service import PasswordHistoryService
from app.Auth.services.forgot_password_service import ForgotPasswordService
from app.Auth.services.reset_password_service import ResetPasswordService
from app.Auth.services.password_service import PasswordService

async def get_jwt_manager() -> JWTManager:
    return JWTManager()

async def get_user_repository() -> UserRepository:
    return UserRepository()

async def get_password_reset_repository() -> PasswordResetRepository:
    return PasswordResetRepository()

async def get_session_repository() -> SessionRepository:
    return SessionRepository()

async def get_refresh_token_repository() -> RefreshTokenRepository:
    return RefreshTokenRepository()

async def get_password_repository() -> PasswordRepository:
    return PasswordRepository()

async def get_password_hasher() -> PasswordHasher:
    return PasswordHasher()

async def get_password_policy() -> PasswordPolicy:
    return PasswordPolicy()

async def get_password_history_service(
    db: AsyncSession = Depends(get_db),
    password_repo: PasswordRepository = Depends(get_password_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher)
) -> PasswordHistoryService:
    return PasswordHistoryService(
        db=db,
        password_repo=password_repo,
        password_hasher=password_hasher
    )

async def get_forgot_password_service(
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    token_repo: PasswordResetRepository = Depends(get_password_reset_repository),
    jwt: JWTManager = Depends(get_jwt_manager),
    email_service = Depends(get_email_service)
) -> ForgotPasswordService:
    return ForgotPasswordService(
        db=db,
        user_repo=user_repo,
        token_repo=token_repo,
        jwt_manager=jwt,
        email_service=email_service
    )

async def get_reset_password_service(
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    token_repo: PasswordResetRepository = Depends(get_password_reset_repository),
    jwt: JWTManager = Depends(get_jwt_manager),
    password_hasher: PasswordHasher = Depends(get_password_hasher),
    password_policy: PasswordPolicy = Depends(get_password_policy),
    session_repo: SessionRepository = Depends(get_session_repository),
    refresh_token_repo: RefreshTokenRepository = Depends(get_refresh_token_repository),
    password_history_service: PasswordHistoryService = Depends(get_password_history_service)
) -> ResetPasswordService:
    return ResetPasswordService(
        db=db,
        user_repo=user_repo,
        token_repo=token_repo,
        jwt_manager=jwt,
        password_hasher=password_hasher,
        password_policy=password_policy,
        session_repo=session_repo,
        refresh_token_repo=refresh_token_repo,
        password_history_service=password_history_service
    )

async def get_password_service(
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    password_hasher: PasswordHasher = Depends(get_password_hasher),
    password_policy: PasswordPolicy = Depends(get_password_policy),
    session_repo: SessionRepository = Depends(get_session_repository),
    refresh_token_repo: RefreshTokenRepository = Depends(get_refresh_token_repository),
    password_history_service: PasswordHistoryService = Depends(get_password_history_service),
    email_service = Depends(get_email_service)
) -> PasswordService:
    return PasswordService(
        db=db,
        user_repo=user_repo,
        password_hasher=password_hasher,
        password_policy=password_policy,
        session_repo=session_repo,
        refresh_token_repo=refresh_token_repo,
        password_history_service=password_history_service,
        email_service=email_service
    )

async def get_current_user(
    authorization: str = Header(..., description="Bearer JWT access token"),
    db: AsyncSession = Depends(get_db),
    user_repo: UserRepository = Depends(get_user_repository),
    jwt: JWTManager = Depends(get_jwt_manager)
):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Use 'Bearer <token>'."
        )
    token = authorization.split(" ")[1]
    validation = jwt.validate_token(token)
    if not validation.is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token."
        )
    if getattr(validation.claims, "typ", None) != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type."
        )
    
    user_id = getattr(validation.claims, "sub", None)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Subject claim missing in token."
        )
    
    from uuid import UUID
    user = await user_repo.get_by_uuid(db, UUID(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found."
        )
    return user

