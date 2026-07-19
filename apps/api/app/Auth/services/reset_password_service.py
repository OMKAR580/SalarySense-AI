import logging
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.auth.recovery_exceptions import ResetTokenInvalid, ResetTokenExpired
from app.Auth.repositories.password_reset import PasswordResetRepository
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.session import SessionRepository
from app.Auth.repositories.refresh_token import RefreshTokenRepository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.security.password import PasswordHasher
from app.Auth.security.policy import PasswordPolicy
from app.Auth.services.password_history_service import PasswordHistoryService
from app.Auth.services.events import PasswordResetCompleted
from app.Auth.services.audit import AuditContract
from app.Auth.security.crypto import sha256

logger = logging.getLogger(__name__)

class ResetPasswordService:
    def __init__(
        self,
        db: AsyncSession,
        user_repo: UserRepository,
        token_repo: PasswordResetRepository,
        jwt_manager: JWTManager,
        password_hasher: PasswordHasher,
        password_policy: PasswordPolicy,
        session_repo: SessionRepository,
        refresh_token_repo: RefreshTokenRepository,
        password_history_service: PasswordHistoryService,
        event_dispatcher: Optional[Any] = None,
        audit: Optional[AuditContract] = None
    ):
        self.db = db
        self.user_repo = user_repo
        self.token_repo = token_repo
        self.jwt_manager = jwt_manager
        self.password_hasher = password_hasher
        self.password_policy = password_policy
        self.session_repo = session_repo
        self.refresh_token_repo = refresh_token_repo
        self.password_history_service = password_history_service
        self.event_dispatcher = event_dispatcher
        self.audit = audit

    async def reset_password(self, token: str, new_password: str) -> dict:
        """
        Purpose: Reset password using a short-lived token.
        Raises: ResetTokenInvalid, ResetTokenExpired, ValueError
        """
        try:
            # 1. Validate JWT
            validation = self.jwt_manager.validate_token(token)
            if not validation.is_valid:
                raise ResetTokenInvalid("Invalid token signature or structure.")

            # 2. Validate token claims
            if getattr(validation.claims, "iss", None) != self.jwt_manager.issuer:
                raise ResetTokenInvalid("Invalid token issuer.")
            if getattr(validation.claims, "aud", None) != self.jwt_manager.audience:
                raise ResetTokenInvalid("Invalid token audience.")
            if getattr(validation.claims, "typ", None) not in ("password_reset", "PASSWORD_RESET"):
                raise ResetTokenInvalid("Invalid token type.")

            # 3. Check DB Token Record
            token_hash = sha256(token)
            query = select(self.token_repo.model).filter(self.token_repo.model.token_hash == token_hash)
            res = await self.db.execute(query)
            token_record = res.scalars().first()

            if not token_record:
                raise ResetTokenInvalid("Reset token not found or invalid.")

            if getattr(token_record, "is_used", False):
                raise ResetTokenInvalid("Reset token already used (replay attack detected).")

            expires_at = token_record.expires_at
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if datetime.now(timezone.utc) > expires_at:
                raise ResetTokenExpired("Reset token has expired.")

            # 4. Resolve Identity
            user = await self.user_repo.get_by_id(self.db, token_record.user_id)
            if not user:
                raise ValueError("User not found.")

            # 5. Check Identity Statuses
            if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                raise ValueError("Account is deleted.")
            if getattr(user, "status", None) == "locked":
                raise ValueError("Account is locked.")
            if getattr(user, "status", None) == "disabled" or (not getattr(user, "is_active", False) and getattr(user, "status", None) != "PENDING_VERIFICATION"):
                raise ValueError("Account is disabled.")
            if not getattr(user, "is_verified", False):
                raise ValueError("Email is not verified.")

            # 6. Validate Password Policy
            policy_result = self.password_policy.validate(new_password, username=user.username, email=user.email)
            if not policy_result.is_valid:
                raise ValueError("; ".join(policy_result.errors))

            # 7. Validate Password History
            await self.password_history_service.validate_password_not_reused(user.id, new_password)

            # 8. Hash and Save Password
            hashed_pwd = self.password_hasher.hash_password(new_password)
            await self.user_repo.update_password_hash(self.db, user, hashed_pwd)

            # 9. Add to Password History
            await self.password_history_service.add_to_history(user.id, hashed_pwd)

            # 10. Revoke Reset Token
            await self.token_repo.mark_used(self.db, token_record.id)

            # 11. Revoke active sessions & refresh family
            await self.session_repo.revoke_all_sessions(self.db, user.id)
            await self.refresh_token_repo.revoke_all(self.db, user.id)

            # 12. Dispatch Events
            if self.event_dispatcher:
                await self.event_dispatcher.dispatch(PasswordResetCompleted(
                    user_id=user.id,
                    timestamp=datetime.now(timezone.utc)
                ))

            # 13. Audit Event
            if self.audit:
                await self.audit.record_security_event(
                    event_type="PASSWORD_RESET_SUCCESS",
                    user_id=user.id,
                    details=f"Password reset successfully completed for user {user.id}"
                )

            # 14. Commit Transaction
            await self.db.commit()
            return {"status": "success", "message": "Password has been reset."}

        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in reset_password: {e}")
            raise e
