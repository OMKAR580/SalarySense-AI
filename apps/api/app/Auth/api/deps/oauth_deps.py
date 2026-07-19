from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.api.deps import get_db, get_email_service
from app.Auth.api.deps.login_deps import get_jwt_manager
from app.Auth.auth.oauth.oauth_service import OAuthService
from app.Auth.security.jwt.manager import JWTManager

async def get_oauth_service(
    db: AsyncSession = Depends(get_db),
    jwt_manager: JWTManager = Depends(get_jwt_manager)
) -> OAuthService:
    return OAuthService(db=db, jwt_manager=jwt_manager)
