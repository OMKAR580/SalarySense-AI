from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.api.deps import get_db
from app.Auth.services.organization_service import OrganizationService
from app.Auth.services.user_service import UserService
from app.Auth.repositories.user import user_repository

async def get_org_service(db: AsyncSession = Depends(get_db)) -> OrganizationService:
    return OrganizationService(db)

async def get_user_service(db: AsyncSession = Depends(get_db)) -> UserService:
    return UserService(user_repository)
