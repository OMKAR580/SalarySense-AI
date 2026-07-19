import hashlib
import secrets
from typing import Any, Optional, Dict
from uuid import uuid4, UUID
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.schemas.login import (
    LoginRequest, LoginResponse, SessionResponse, 
    RefreshRequest, LogoutRequest, CurrentUserResponse
)
from app.Auth.config.login_settings import login_config
from app.Auth.auth.login.exceptions import (
    InvalidCredentials, AccountLocked, EmailNotVerified, 
    SessionExpired, RefreshExpired, ConcurrentLimitReached
)
from app.Auth.security.password import PasswordHasher
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.auth.identity.repository_resolver import RepositoryIdentityResolver
from app.Auth.auth.identity.states import IdentityStatus
from app.Auth.auth.identity.mappers import IdentityMapper

from app.Auth.repositories.two_factor import two_factor_repository
from app.Auth.repositories.trusted_device import trusted_device_repository
from app.Auth.repositories.device import device_repository
from app.Auth.repositories.system_setting import system_setting_repository
from app.Auth.models.system_setting import SystemSetting
from app.Auth.services.events import ChallengeCreated

class LoginService:
    def __init__(
        self,
        db: AsyncSession,
        jwt_manager: JWTManager,
        identity_resolver: RepositoryIdentityResolver,
        audit_service: Any = None,
        two_factor_repo=two_factor_repository,
        trusted_device_repo=trusted_device_repository,
        device_repo=device_repository,
        system_setting_repo=system_setting_repository,
        email_service: Any = None,
        event_dispatcher: Any = None
    ):
        self.db = db
        self.jwt_manager = jwt_manager
        self.identity_resolver = identity_resolver
        self.password_hasher = PasswordHasher()
        self.audit = audit_service
        self.two_factor_repo = two_factor_repo
        self.trusted_device_repo = trusted_device_repo
        self.device_repo = device_repo
        self.system_setting_repo = system_setting_repo
        self.email_service = email_service
        self.event_dispatcher = event_dispatcher
        
    async def validate_credentials(self, request: LoginRequest, ip_address: Optional[str] = None) -> Any:
        identity = await self.identity_resolver.resolve(request.identifier)
        if not identity:
            if self.audit: await self.audit.record_login_failed(request.identifier, "User not found", ip_address)
            raise InvalidCredentials("Invalid credentials")

        if identity.status == IdentityStatus.LOCKED:
            if self.audit: await self.audit.record_login_failed(request.identifier, "Account locked", ip_address)
            raise AccountLocked("Account is locked")
            
        if identity.status == IdentityStatus.UNVERIFIED:
            raise EmailNotVerified("Email not verified")

        if not self.password_hasher.verify_password(request.password, identity.security.password_hash):
            if self.audit: await self.audit.record_login_failed(request.identifier, "Wrong password", ip_address)
            raise InvalidCredentials("Invalid credentials")
            
        return identity

    async def create_session(
        self, 
        identity: Any, 
        device_name: Optional[str] = None, 
        ip_address: Optional[str] = None,
        device_id: Optional[UUID] = None
    ) -> SessionResponse:
        session_id = uuid4()
        if self.audit: await self.audit.record_session_created(session_id)
        
        from app.Auth.repositories.session import session_repository
        await session_repository.create_session_record(
            db=self.db,
            user_id=identity.id,
            session_id=session_id,
            device_id=device_id,
            duration_minutes=1440  # 24 hours
        )
        
        return SessionResponse(
            session_id=session_id,
            ip_address=ip_address,
            device_name=device_name,
            created_at=datetime.now(timezone.utc),
            last_active=datetime.now(timezone.utc)
        )

    async def issue_tokens(self, identity: Any, session: SessionResponse) -> Dict[str, Any]:
        custom_claims = {
            "email": identity.email,
            "username": identity.username,
            "roles": [r.name for r in identity.roles],
            "permissions": [p.name for p in identity.permissions],
            "session_id": str(session.session_id),
            "mfa_verified": False,
            "authentication_method": "password",
            "authentication_level": 1,
            "trusted_device": False
        }
        
        token_pair = self.jwt_manager.create_token_pair(str(identity.id), custom_claims)
        
        return {
            "access_token": token_pair.access_token.token,
            "refresh_token": token_pair.refresh_token.token,
            "expires_in": token_pair.access_token.expires_in
        }

    async def login(self, request: LoginRequest, ip_address: Optional[str] = None) -> LoginResponse:
        try:
            # Step 1: Validate Credentials via Identity Engine & Security Core
            identity = await self.validate_credentials(request, ip_address)
            
            # Step 2: Check if MFA is enabled and verify trusted device bypass
            methods = await self.two_factor_repo.get_verified_by_user(self.db, identity.id)
            if methods:
                device_is_trusted = False
                if request.device_identifier:
                    device = await self.device_repo.get_by_user_and_identifier(self.db, identity.id, request.device_identifier)
                    if device:
                        trusted_records = await self.trusted_device_repo.get_by_user(self.db, identity.id)
                        now = datetime.now(timezone.utc)
                        for tr in trusted_records:
                            if tr.device_id == device.id:
                                expires_at = tr.trusted_until
                                if expires_at.tzinfo is None:
                                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                                if expires_at > now:
                                    device_is_trusted = True
                                    break
                
                if not device_is_trusted:
                    challenge_jti = uuid4()
                    primary = next((m for m in methods if m.is_primary), methods[0])
                    
                    claims = {
                        "sub": str(identity.id),
                        "jti": str(challenge_jti),
                        "typ": "mfa_challenge",
                        "metadata": {
                            "method": primary.method_type
                        }
                    }
                    challenge_token = self.jwt_manager.create_token(str(identity.id), "mfa_challenge", claims)
                    
                    if primary.method_type == "email":
                        otp = "".join(secrets.choice("0123456789") for _ in range(6))
                        otp_hash = hashlib.sha256(otp.encode("utf-8")).hexdigest()
                        otp_key = f"email_otp:{challenge_jti}"
                        state = {
                            "hash": otp_hash,
                            "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=5)).isoformat(),
                            "attempts": 0
                        }
                        setting = SystemSetting(
                            key=otp_key,
                            value=state,
                            description=f"Email OTP state for challenge {challenge_jti}",
                            is_active=True
                        )
                        self.db.add(setting)
                        await self.db.flush()
                        if self.email_service:
                            await self.email_service.send_mfa_otp(identity.email, otp)

                    if self.event_dispatcher:
                        await self.event_dispatcher.dispatch(ChallengeCreated(
                            user_id=identity.id,
                            challenge_id=challenge_jti,
                            method_type=primary.method_type,
                            timestamp=datetime.now(timezone.utc)
                        ))
                    
                    await self.db.commit()
                    return LoginResponse(
                        user_id=identity.id,
                        mfa_required=True,
                        challenge_id=challenge_token.token
                    )

            # Step 3: Create Session
            device_id = None
            if request.device_identifier:
                device = await self.device_repo.get_by_user_and_identifier(self.db, identity.id, request.device_identifier)
                if device:
                    device_id = device.id
            
            session = await self.create_session(identity, request.device_name, ip_address, device_id)
            
            # Step 4: Issue Tokens via JWT Infrastructure
            tokens = await self.issue_tokens(identity, session)
            
            if self.audit: await self.audit.record_login_success(identity.id, ip_address)
            
            await self.db.commit()
            return LoginResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                expires_in=tokens["expires_in"],
                session=session,
                user_id=identity.id,
                mfa_required=False,
                email=identity.email,
                username=identity.username,
                avatar=getattr(identity, 'avatar', None)
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            await self.db.rollback()
            raise e

    async def refresh(self, request: RefreshRequest) -> LoginResponse:
        try:
            # 1. Validate refresh token
            validation = self.jwt_manager.validate_token(request.refresh_token, expected_type="refresh")
            if not validation.is_valid:
                print(f"Refresh validation failed: {validation.error}")
                raise RefreshExpired(f"Refresh token expired or invalid: {validation.error}")
                
            claims = validation.claims
            # 2. Resolve Identity
            identity = await self.identity_resolver.resolve_by_user_id(UUID(claims.sub))
            if not identity:
                raise InvalidCredentials("User not found")
                
            # 3. Re-issue Tokens (Session remains same conceptually)
            session = await self.create_session(identity)
            tokens = await self.issue_tokens(identity, session)
            
            if self.audit: await self.audit.record_token_refresh(identity.id)
            
            await self.db.commit()
            return LoginResponse(
                access_token=tokens["access_token"],
                refresh_token=tokens["refresh_token"],
                expires_in=tokens["expires_in"],
                session=session,
                user_id=identity.id,
                mfa_required=False,
                email=identity.email,
                username=identity.username,
                avatar=getattr(identity, 'avatar', None)
            )
        except Exception as e:
            raise RefreshExpired(str(e))

    async def logout(self, request: LogoutRequest) -> bool:
        try:
            if request.refresh_token:
                validation = self.jwt_manager.validate_token(request.refresh_token, expected_type="refresh")
                if validation.is_valid:
                    claims = validation.claims
                    user_id = UUID(claims.sub)
                    session_id_str = getattr(claims, "session_id", None)
                    
                    from app.Auth.repositories.session import session_repository
                    if request.all_devices:
                        await session_repository.revoke_all_sessions(self.db, user_id)
                    elif session_id_str:
                        await session_repository.revoke_session(self.db, UUID(session_id_str))
                    
                    await self.db.commit()
                    if self.audit: 
                        await self.audit.record_logout(user_id, UUID(session_id_str) if session_id_str else uuid4())
                    return True
        except Exception:
            pass
        
        if self.audit: await self.audit.record_logout(uuid4(), uuid4())
        return True
