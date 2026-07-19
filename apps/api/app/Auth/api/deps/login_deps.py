from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.api.deps import get_db
from app.Auth.api.identity_deps import get_identity_resolver
from app.Auth.services.login_service import LoginService
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.auth.identity.repository_resolver import RepositoryIdentityResolver

async def get_jwt_manager() -> JWTManager:
    return JWTManager()

async def get_login_service(
    db: AsyncSession = Depends(get_db),
    jwt: JWTManager = Depends(get_jwt_manager),
    identity_resolver: RepositoryIdentityResolver = Depends(get_identity_resolver)
) -> LoginService:
    return LoginService(db=db, jwt_manager=jwt, identity_resolver=identity_resolver)
