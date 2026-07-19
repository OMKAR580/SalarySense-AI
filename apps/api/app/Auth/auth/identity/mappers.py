from typing import Any
from datetime import datetime
from app.Auth.auth.identity.models import (
    Identity, IdentityProfile, IdentitySecurity, IdentityMetadata, 
    IdentityPreferences, IdentityRole, IdentityPermission
)
from app.Auth.auth.identity.states import IdentityStatus
from app.Auth.auth.context import AuthenticationContext
from app.Auth.security.jwt.models import JWTClaims
from app.Auth.models.user import User
from app.Auth.auth.identity.exceptions import IdentityMappingFailure

class IdentityMapper:
    @staticmethod
    def db_to_identity(user: User) -> Identity:
        try:
            roles = []
            permissions = []
            
            # Defensive loading if relationships exist
            if hasattr(user, 'roles') and user.roles is not None:
                for r in user.roles:
                    roles.append(IdentityRole(name=r.name, description=r.description))
                    if hasattr(r, 'permissions') and r.permissions:
                        for p in r.permissions:
                            permissions.append(IdentityPermission(name=p.name, resource="*", action="*"))
            
            # Map flags to IdentityStatus logic
            status = IdentityStatus.ACTIVE
            if hasattr(user, 'is_verified') and not user.is_verified:
                status = IdentityStatus.UNVERIFIED
            elif not user.is_active:
                status = IdentityStatus.DISABLED
            
            return Identity(
                id=user.id,
                email=user.email,
                status=status,
                username=user.username if hasattr(user, 'username') else None,
                profile=IdentityProfile(
                    first_name=getattr(user, "first_name", None),
                    last_name=getattr(user, "last_name", None)
                ),
                security=IdentitySecurity(
                    password_hash=getattr(user, "password_hash", None) or getattr(user, "hashed_password", None),
                    mfa_enabled=user.is_superuser # Placeholder metric
                ),
                metadata=IdentityMetadata(
                    created_at=user.created_at,
                    updated_at=user.updated_at
                ),
                roles=roles,
                permissions=permissions
            )
        except Exception as e:
            raise IdentityMappingFailure(f"Failed to map Database model to Identity: {e}")

    @staticmethod
    def identity_to_claims(identity: Identity) -> JWTClaims:
        return JWTClaims(
            sub=str(identity.id),
            iss="", 
            aud="", 
            iat=0, 
            exp=0,
            user_id=str(identity.id),
            email=identity.email,
            username=identity.username,
            roles=[r.name for r in identity.roles],
            permissions=[p.name for p in identity.permissions]
        )
