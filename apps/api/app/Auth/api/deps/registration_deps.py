from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.api.deps import get_db, get_email_service
from app.Auth.services.registration_service import RegistrationService
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.services.email_service import EmailService

async def get_jwt_manager() -> JWTManager:
    return JWTManager()

async def get_registration_service(
    db: AsyncSession = Depends(get_db),
    jwt: JWTManager = Depends(get_jwt_manager),
    email: EmailService = Depends(get_email_service)
) -> RegistrationService:
    return RegistrationService(db=db, jwt_manager=jwt, email_service=email)
