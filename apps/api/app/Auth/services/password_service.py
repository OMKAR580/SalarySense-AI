import logging
from uuid import UUID
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.config.password_settings import password_settings
from app.Auth.repositories.user import UserRepository
from app.Auth.repositories.session import SessionRepository
from app.Auth.repositories.refresh_token import RefreshTokenRepository
from app.Auth.security.password import PasswordHasher
from app.Auth.security.policy import PasswordPolicy
from app.Auth.services.password_history_service import PasswordHistoryService
from app.Auth.services.email_service import EmailService
from app.Auth.services.events import PasswordChanged
from app.Auth.services.audit import AuditContract

logger = logging.getLogger(__name__)

class PasswordService:
    def __init__(
        self,
        db: AsyncSession,
        user_repo: UserRepository,
        password_hasher: PasswordHasher,
        password_policy: PasswordPolicy,
        session_repo: SessionRepository,
        refresh_token_repo: RefreshTokenRepository,
        password_history_service: PasswordHistoryService,
        email_service: EmailService,
        event_dispatcher: Optional[Any] = None,
        audit: Optional[AuditContract] = None
    ):
        self.db = db
        self.user_repo = user_repo
        self.password_hasher = password_hasher
        self.password_policy = password_policy
        self.session_repo = session_repo
        self.refresh_token_repo = refresh_token_repo
        self.password_history_service = password_history_service
        self.email_service = email_service
        self.event_dispatcher = event_dispatcher
        self.audit = audit

    async def change_password(self, user_id: UUID, current_password: str, new_password: str) -> dict:
        """
        Purpose: Change password for an authenticated user.
        Raises: ValueError
        """
        try:
            # 1. Resolve user
            user = await self.user_repo.get_by_id(self.db, user_id)
            if not user:
                raise ValueError("User not found.")

            # 2. Reject deleted, disabled, or locked users
            if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                raise ValueError("Account is deleted.")
            if getattr(user, "status", None) == "locked":
                raise ValueError("Account is locked.")
            if getattr(user, "status", None) == "disabled" or (not getattr(user, "is_active", False) and getattr(user, "status", None) != "PENDING_VERIFICATION"):
                raise ValueError("Account is disabled.")

            # 3. Verify current password
            if not self.password_hasher.verify_password(current_password, user.password_hash):
                raise ValueError("Invalid current password.")

            # 4. Validate new password against policy
            policy_result = self.password_policy.validate(new_password, username=user.username, email=user.email)
            if not policy_result.is_valid:
                raise ValueError("; ".join(policy_result.errors))

            # 5. Enforce password history
            await self.password_history_service.validate_password_not_reused(user.id, new_password)

            # 6. Hash and update password
            hashed_pwd = self.password_hasher.hash_password(new_password)
            await self.user_repo.update_password_hash(self.db, user, hashed_pwd)

            # 7. Add to history
            await self.password_history_service.add_to_history(user.id, hashed_pwd)

            # 8. Revoke sessions and refresh tokens based on config
            if password_settings.force_logout:
                await self.session_repo.revoke_all_sessions(self.db, user.id)
            await self.refresh_token_repo.revoke_all(self.db, user.id)

            # 9. Send email notification
            if password_settings.notify_password_change:
                await self.email_service.send_password_changed_email(user.email)

            # 10. Emit Events
            if self.event_dispatcher:
                await self.event_dispatcher.dispatch(PasswordChanged(
                    user_id=user.id,
                    timestamp=datetime.now(timezone.utc)
                ))

            # 11. Audit log
            if self.audit:
                await self.audit.record_security_event(
                    event_type="PASSWORD_CHANGED",
                    user_id=user.id,
                    details=f"Password changed for user {user.id} through authenticated change-password flow."
                )

            # 12. Commit Transaction
            await self.db.commit()
            return {"status": "success", "message": "Password changed successfully."}

        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error in change_password: {e}")
            raise e
