from pydantic_settings import BaseSettings

class CacheConfiguration(BaseSettings):
    enabled: bool = True
    ttl_seconds: int = 3600
    backend: str = "memory"

class ValidationConfiguration(BaseSettings):
    strict_mode: bool = True
    require_email_verification: bool = False

class ResolverConfiguration(BaseSettings):
    allow_email_resolution: bool = True
    allow_username_resolution: bool = True
    allow_phone_resolution: bool = False
    max_lookup_depth: int = 3
    relationship_loading: str = "selectinload"
    allow_deleted_lookup: bool = False
    allow_disabled_lookup: bool = True

class IdentityConfiguration(BaseSettings):
    cache: CacheConfiguration = CacheConfiguration()
    validation: ValidationConfiguration = ValidationConfiguration()
    resolver: ResolverConfiguration = ResolverConfiguration()

identity_config = IdentityConfiguration()
