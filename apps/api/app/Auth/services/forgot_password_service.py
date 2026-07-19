import re
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.auth.recovery_exceptions import ResetTokenInvalid
from app.Auth.config.password_settings import password_settings
from app.Auth.repositories.password_reset import PasswordResetRepository
from app.Auth.repositories.user import UserRepository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.services.email_service import EmailService
from app.Auth.services.events import PasswordResetRequested
from app.Auth.services.audit import AuditContract
from app.Auth.security.crypto import sha256

logger = logging.getLogger(__name__)

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

class ForgotPasswordService:
    def __init__(
        self,
        db: AsyncSession,
        user_repo: UserRepository,
        token_repo: PasswordResetRepository,
        jwt_manager: JWTManager,
        email_service: EmailService,
        event_dispatcher: Optional[Any] = None,
        audit: Optional[AuditContract] = None
    ):
        self.db = db
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.jwt_manager = jwt_manager
        self.email_service = email_service
        self.event_dispatcher = event_dispatcher
        self.audit = audit

    async def request_reset(self, email: str) -> dict:
        """
        Purpose: Process password reset request for a user.
        Raises: ValueError
        """
        if not email or not EMAIL_REGEX.match(email):
            raise ValueError("Invalid email format.")

        try:
            # Resolve identity
            user = await self.user_repo.get_by_email(self.db, email)
            if not user:
                raise ValueError("User not found.")

            # Reject deleted users
            if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                raise ValueError("Account is deleted.")

            # Reject locked users
            if getattr(user, "status", None) == "locked":
                raise ValueError("Account is locked.")

            # Reject disabled users
            if getattr(user, "status", None) == "disabled" or (not getattr(user, "is_active", False) and getattr(user, "status", None) != "PENDING_VERIFICATION"):
                raise ValueError("Account is disabled.")

            # Reject unverified users
            if not getattr(user, "is_verified", False):
                raise ValueError("Email is not verified.")

            # Cooldown and Rate Limiting Check
            tokens = await self.token_repo.get_tokens_by_user(self.db, user.id)

            now = datetime.now(timezone.utc)

            if tokens:
                last_token = tokens[0]
                last_created = last_token.created_at
                if last_created.tzinfo is None:
                    last_created = last_created.replace(tzinfo=timezone.utc)
                
                cooldown_delta = now - last_created
                if cooldown_delta.total_seconds() < password_settings.reset_cooldown * 60:
                    raise ValueError("Reset request too frequent. Please wait.")

                # Max reset requests limit (e.g. 24h window)
                day_ago = now - timedelta(hours=24)
                recent_requests = [
                    t for t in tokens 
                    if (t.created_at.replace(tzinfo=timezone.utc) if t.created_at.tzinfo is None else t.created_at) > day_ago
                ]
                if len(recent_requests) >= password_settings.max_reset_requests:
                    raise ValueError("Maximum password reset requests exceeded for today.")

            # Generate Reset Token JWT
            token_meta = self.jwt_manager.create_token(
                subject=str(user.id),
                token_type="password_reset",
                custom_claims={"email": user.email}
            )

            # Persist Token Metadata
            token_hash = sha256(token_meta.token)
            expires_at = now + timedelta(minutes=password_settings.reset_expiration_minutes)

            token_data = {
                "user_id": user.id,
                "token_hash": token_hash,
                "expires_at": expires_at,
                "is_used": False
            }
            await self.token_repo.create_token(self.db, token_data)

            # Send Email
            email_sent = await self.email_service.send_reset_email(user.email, token_meta.token)
            if not email_sent:
                raise RuntimeError("Failed to send reset email.")

            # Emit Events
            if self.event_dispatcher:
                await self.event_dispatcher.dispatch(PasswordResetRequested(
                    user_id=user.id,
                    email=user.email,
                    timestamp=now
                ))

            # Audit Event
            if self.audit:
                await self.audit.record_security_event(
                    event_type="PASSWORD_RESET_REQUEST",
                    user_id=user.id,
                    details=f"Password reset requested for {user.email} from forgot-password flow."
                )

            # Commit Transaction
            await self.db.commit()
            return {"status": "success", "message": "Password reset email sent."}

        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in request_reset: {e}")
            raise e
