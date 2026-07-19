from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
# Assume get_db exists
from app.Auth.api.deps import get_db
from app.Auth.auth.identity.repository_resolver import RepositoryIdentityResolver
from app.Auth.auth.identity.cache_impl import MemoryCacheImpl
from app.Auth.auth.identity.validator import PipelineIdentityValidator
from app.Auth.auth.identity.policy import AccountEnabledPolicy

# Singleton Cache
_identity_cache = MemoryCacheImpl()

async def get_identity_cache():
    return _identity_cache

async def get_identity_resolver(db: AsyncSession = Depends(get_db)):
    return RepositoryIdentityResolver(db)

async def get_identity_validator():
    policies = [AccountEnabledPolicy()]
    return PipelineIdentityValidator(policies=policies)
