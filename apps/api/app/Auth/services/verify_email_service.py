import logging
from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.auth.verification_exceptions import (
    InvalidVerificationToken,
    ExpiredVerificationToken,
    AlreadyVerified
)
from app.Auth.auth.verification_events import VerificationEvent, VerificationEventType
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.email_verification import EmailVerificationRepository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.security.crypto import sha256

logger = logging.getLogger(__name__)

def ensure_timezone_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        raise ValueError("Naive datetime objects are not allowed")
    return dt

class VerifyEmailService:
    def __init__(
        self,
        db: AsyncSession,
        user_repo: UserRepository,
        token_repo: EmailVerificationRepository,
        jwt_manager: JWTManager,
        event_dispatcher: getattr = None,
        audit_service: getattr = None
    ):
        self.db = db
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.jwt_manager = jwt_manager
        self.event_dispatcher = event_dispatcher
        self.audit = audit_service

    async def verify_email(self, token: str) -> dict:
        try:
            is_otp = len(token) == 6 and token.isdigit()
            if is_otp:
                hashed = sha256(token)
            else:
                # 1. Decode and Validate JWT signature & expiration
                validation = self.jwt_manager.validate_token(token, expected_type="EMAIL_VERIFICATION")
                if not validation.is_valid:
                    if "expired" in validation.error.lower():
                        raise ExpiredVerificationToken("Verification token has expired")
                    raise InvalidVerificationToken(f"Invalid verification token: {validation.error}")
                    
                claims = validation.claims
                
                # Explicit JWT claim validations
                if not claims.sub:
                    raise InvalidVerificationToken("Token missing subject claim")
                if not claims.email:
                    raise InvalidVerificationToken("Token missing email claim")
                if claims.typ != "EMAIL_VERIFICATION":
                    raise InvalidVerificationToken("Invalid token type")
                if claims.iss:
                    from app.Auth.config.verification_settings import verification_settings
                    if claims.iss != verification_settings.ISSUER:
                        raise InvalidVerificationToken("Invalid issuer")
                hashed = sha256(token)
                
            now = datetime.now(timezone.utc)
            ensure_timezone_aware(now)
            
            # 2. Retrieve token from database using select for update to prevent race conditions
            query = select(self.token_repo.model).filter(self.token_repo.model.token_hash == hashed)
            if self.db.bind and self.db.bind.dialect.name != 'sqlite':
                query = query.with_for_update()
            
            result = await self.db.execute(query)
            token_record = result.scalars().first()
            
            if not token_record:
                raise InvalidVerificationToken("Verification record not found")
                
            if token_record.is_used:
                raise AlreadyVerified("Email is already verified")
                
            # Naive datetime checking for token record
            token_expires_at = token_record.expires_at
            if token_expires_at.tzinfo is None:
                token_expires_at = token_expires_at.replace(tzinfo=timezone.utc)
                
            if token_expires_at < now:
                raise ExpiredVerificationToken("Verification record expired")
                
            # 3. Retrieve user
            user = await self.user_repo.get_by_id(self.db, token_record.user_id)
            if not user:
                raise InvalidVerificationToken("User associated with token not found")
                
            # Validate user account status
            if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                raise InvalidVerificationToken("User account has been deleted")
                
            if getattr(user, "status", None) == "disabled" or (not getattr(user, "is_active", True) and getattr(user, "status", None) != "PENDING_VERIFICATION"):
                raise InvalidVerificationToken("User account is disabled")
                
            if getattr(user, "status", None) == "locked":
                raise InvalidVerificationToken("User account is locked")
                
            if getattr(user, "is_verified", False):
                # Mark token as verified/used just in case
                await self.token_repo.verify(self.db, token_record.id)
                await self.db.flush()
                await self.db.commit()
                raise AlreadyVerified("Email is already verified")
                
            # 4. Activate user and mark email verified
            user.is_verified = True
            user.is_active = True
            user.status = "active"
            self.db.add(user)
            
            # 5. Mark verification token as used
            await self.token_repo.verify(self.db, token_record.id)
            
            # Flush changes to the DB
            await self.db.flush()
            
            # 6. Audit & Events
            if self.audit:
                await self.audit.record_email_verified(user.id)
                
            if self.event_dispatcher:
                event = VerificationEvent(
                    event_type=VerificationEventType.EMAIL_VERIFIED,
                    user_id=str(user.id),
                    metadata={"email": user.email}
                )
                await self.event_dispatcher.dispatch(event)
                
            # Final commit inside the service to guarantee transaction safety
            await self.db.commit()
            
            return {"status": "success", "message": "Email verified successfully"}
            
        except Exception as e:
            # Revert any database changes on failure to prevent corrupted database state
            await self.db.rollback()
            logger.error(f"Error during email verification: {e}")
            raise e
