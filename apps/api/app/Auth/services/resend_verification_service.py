import logging
import re
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.auth.verification_exceptions import (
    AlreadyVerified,
    VerificationLimitExceeded
)
from app.Auth.auth.verification_events import VerificationEvent, VerificationEventType
from app.Auth.config.verification_settings import verification_settings
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.email_verification import EmailVerificationRepository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.security.crypto import sha256

logger = logging.getLogger(__name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

def ensure_timezone_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None or dt.tzinfo.utcoffset(dt) is None:
        raise ValueError("Naive datetime objects are not allowed")
    return dt

class ResendVerificationService:
    def __init__(
        self,
        db: AsyncSession,
        user_repo: UserRepository,
        token_repo: EmailVerificationRepository,
        jwt_manager: JWTManager,
        email_service: getattr = None,
        event_dispatcher: getattr = None,
        audit_service: getattr = None
    ):
        self.db = db
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.jwt_manager = jwt_manager
        self.email_service = email_service
        self.event_dispatcher = event_dispatcher
        self.audit = audit_service

    async def resend_verification(self, email: str) -> dict:
        try:
            # 1. Validate email format
            if not email or not EMAIL_REGEX.match(email):
                raise ValueError("Invalid email format")

            # 2. Resolve user
            user = await self.user_repo.get_by_email(self.db, email)
            if not user:
                raise ValueError("User with this email does not exist")
                
            # 3. Validate user account status
            if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                raise ValueError("User account has been deleted")
                
            if getattr(user, "status", None) == "disabled" or (not getattr(user, "is_active", True) and getattr(user, "status", None) != "PENDING_VERIFICATION"):
                raise ValueError("User account is disabled")
                
            if getattr(user, "status", None) == "locked":
                raise ValueError("User account is locked")

            # 4. Check if already verified
            if getattr(user, "is_verified", False) or getattr(user, "status", None) == "active":
                raise AlreadyVerified("Email is already verified")

            now = datetime.now(timezone.utc)
            ensure_timezone_aware(now)

            # 5. Check resend cooldown and attempts
            query = select(self.token_repo.model).filter(
                self.token_repo.model.user_id == user.id
            ).order_by(self.token_repo.model.created_at.desc())
            
            # Select with for update to prevent concurrent resends
            if self.db.bind and self.db.bind.dialect.name != 'sqlite':
                query = query.with_for_update()

            result = await self.db.execute(query)
            tokens = result.scalars().all()
            
            if tokens:
                # Cooldown check: most recent token
                most_recent = tokens[0]
                mr_created_at = most_recent.created_at
                if mr_created_at.tzinfo is None:
                    mr_created_at = mr_created_at.replace(tzinfo=timezone.utc)
                    
                cooldown_seconds = verification_settings.RESEND_COOLDOWN_MINUTES * 60
                if (now - mr_created_at).total_seconds() < cooldown_seconds:
                    raise VerificationLimitExceeded("Verification email was sent recently. Please wait before retrying.")
                
                # Max attempts check: total tokens generated in the last 24 hours
                recent_attempts = 0
                for t in tokens:
                    t_created_at = t.created_at
                    if t_created_at.tzinfo is None:
                        t_created_at = t_created_at.replace(tzinfo=timezone.utc)
                    if (now - t_created_at).total_seconds() < 86400: # 24 hours
                        recent_attempts += 1
                
                if recent_attempts >= verification_settings.MAX_RESEND_ATTEMPTS:
                    raise VerificationLimitExceeded("Maximum verification resend attempts reached. Please try again tomorrow.")

            # 6. Issue fresh 6-digit OTP
            import secrets
            otp = "".join(secrets.choice("0123456789") for _ in range(6))
            
            # 7. Persist the token to DB
            expires_delta = timedelta(minutes=15) # 15 minutes standard lifetime for numeric OTPs
            token_data = {
                "user_id": user.id,
                "token_hash": sha256(otp),
                "expires_at": now + expires_delta,
                "is_used": False
            }
            await self.token_repo.create_token(self.db, token_data)
            await self.db.flush()

            # 8. Dispatch email
            if self.email_service:
                success = await self.email_service.send_verification_email(user.email, otp)
                if not success:
                    raise RuntimeError("Email service failed to send email")
                
            # 9. Audit & Event
            if self.audit:
                await self.audit.record_email_verification_resent(user.id)
                
            if self.event_dispatcher:
                event = VerificationEvent(
                    event_type=VerificationEventType.VERIFICATION_RESENT,
                    user_id=str(user.id),
                    metadata={"email": user.email, "attempt": len(tokens) + 1}
                )
                await self.event_dispatcher.dispatch(event)
                
            # Final commit inside the service to guarantee transaction safety
            await self.db.commit()
            
            return {"status": "success", "message": "Verification email has been resent"}

        except Exception as e:
            # Revert database transaction state on any exception (including email failure)
            await self.db.rollback()
            logger.error(f"Error during resending verification: {e}")
            raise e
