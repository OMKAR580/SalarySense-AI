from typing import Dict, Any, Optional
from uuid import uuid4
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.schemas.registration import RegisterRequest, RegisterResponse
from app.Auth.config.registration_settings import registration_config
from app.Auth.auth.registration.exceptions import (
    RegistrationFailed, DuplicateEmail, DuplicateUsername, 
    PasswordTooWeak, RoleAssignmentFailed, VerificationTokenFailed,
    TermsNotAccepted, PasswordMismatch
)
from app.Auth.auth.registration.events import (
    UserRegistered, VerificationTokenCreated, VerificationEmailQueued,
    DefaultRoleAssigned, RegistrationCompleted
)
from app.Auth.repositories.user_repository import UserRepository
from app.Auth.repositories.role_repository import RoleRepository
from app.Auth.security.password import PasswordHasher
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.services.email_service import EmailService

class RegistrationService:
    def __init__(
        self, 
        db: AsyncSession, 
        jwt_manager: JWTManager, 
        email_service: EmailService,
        audit_service: Any = None # placeholder for real audit
    ):
        self.db = db
        self.user_repo = UserRepository()
        self.role_repo = RoleRepository()
        self.jwt_manager = jwt_manager
        self.email_service = email_service
        self.audit = audit_service
        self.password_hasher = PasswordHasher()

    async def _validate_registration(self, request: RegisterRequest) -> None:
        if not request.accept_terms:
            raise TermsNotAccepted("Terms must be accepted")
        if request.password != request.confirm_password:
            raise PasswordMismatch("Passwords do not match")
            
        # Check duplicates
        existing_email = await self.user_repo.get_by_email(self.db, request.email)
        if existing_email:
            if self.audit: await self.audit.record_duplicate_email(request.email)
            raise DuplicateEmail("Email already registered")
            
        existing_username = await self.user_repo.get_by_username(self.db, request.username)
        if existing_username:
            if self.audit: await self.audit.record_duplicate_username(request.username)
            raise DuplicateUsername("Username already taken")
            
        # Note: Password strength check would happen here using zxcvbn or similar in security core
        # For phase 3.4 we assume password passes if it reaches here
        
    async def _create_user(self, request: RegisterRequest) -> Any:
        hashed_password = self.password_hasher.hash_password(request.password)
        
        is_verified = True

        user_data = {
            "email": request.email,
            "username": request.username,
            "password_hash": hashed_password,
            "is_active": True,
            "is_verified": is_verified
        }
        user = await self.user_repo.create(self.db, obj_in=user_data)

        if request.oauth_provider and request.oauth_provider_account_id:
            from app.Auth.repositories.oauth import oauth_repository
            await oauth_repository.link_account(self.db, {
                "user_id": user.id,
                "provider": request.oauth_provider,
                "provider_account_id": request.oauth_provider_account_id,
                "access_token": "OAUTH_SIGNUP_FLOW",
                "refresh_token": None
            })

        return user

    async def _assign_default_role(self, user: Any) -> None:
        role_name = registration_config.default_role
        role = await self.role_repo.get_by_name(self.db, role_name)
        if not role:
            # Create default role if it doesn't exist
            role = await self.role_repo.create(self.db, obj_in={"name": role_name, "description": "Default role"})
            
        # Assuming user_repo has method to assign role
        try:
            await self.role_repo.assign_role(self.db, user.id, role.id)
        except Exception as e:
            raise RoleAssignmentFailed(f"Failed to assign role: {e}")

    async def _send_verification(self, user: Any) -> bool:
        if user.is_verified:
            return False
        if not registration_config.require_email_verification:
            return False
            
        try:
            from datetime import timedelta
            import secrets
            from app.Auth.repositories.email_verification import EmailVerificationRepository
            from app.Auth.config.verification_settings import verification_settings
            from app.Auth.security.crypto import sha256
            
            # Create 6-digit OTP
            otp = "".join(secrets.choice("0123456789") for _ in range(6))
            
            # Persist in DB
            token_repo = EmailVerificationRepository()
            expires_delta = timedelta(minutes=15) # 15 minutes standard lifetime for numeric OTPs
            token_data = {
                "user_id": user.id,
                "token_hash": sha256(otp),
                "expires_at": datetime.utcnow() + expires_delta,
                "is_used": False
            }
            await token_repo.create_token(self.db, token_data)
            await self.db.flush()
            
            # Dispatch
            success = await self.email_service.send_verification_email(user.email, otp)
            if not success and self.audit:
                await self.audit.record_email_dispatch_failure(user.id)
            return success
        except Exception as e:
            if self.audit: await self.audit.record_email_dispatch_failure(user.id)
            # DO NOT throw error here, user remains created
            return False

    async def register(self, request: RegisterRequest) -> RegisterResponse:
        if not registration_config.allow_registration:
            raise RegistrationFailed("Registration is currently disabled")

        if self.audit: await self.audit.record_registration_started(request.email)
        
        try:
            await self._validate_registration(request)
            
            user = await self._create_user(request)
            await self._assign_default_role(user)
            
            token_sent = await self._send_verification(user)
            
            if self.audit: await self.audit.record_registration_success(user.id)
            
            await self.db.commit()
            await self.db.refresh(user)
            
            return RegisterResponse(
                user_id=user.id,
                email=user.email,
                username=user.username,
                status="VERIFIED" if user.is_verified else "PENDING_VERIFICATION",
                verification_required=not user.is_verified,
                verification_token_sent=token_sent,
                message="Registration successful"
            )
        except Exception as e:
            import traceback
            traceback.print_exc()
            await self.db.rollback()
            raise e
