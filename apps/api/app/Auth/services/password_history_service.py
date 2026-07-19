import logging
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from app.Auth.auth.recovery_exceptions import PasswordHistoryViolation
from app.Auth.config.password_settings import password_settings
from app.Auth.repositories.password import PasswordRepository
from app.Auth.security.password import PasswordHasher

logger = logging.getLogger(__name__)

class PasswordHistoryService:
    def __init__(
        self,
        db: AsyncSession,
        password_repo: PasswordRepository,
        password_hasher: PasswordHasher
    ):
        self.db = db
        self.password_repo = password_repo
        self.password_hasher = password_hasher

    async def add_to_history(self, user_id: UUID, password_hash: str) -> None:
        """
        Purpose: Add a new password hash to the user's password history.
        """
        max_len = password_settings.history_length
        await self.password_repo.add_to_history(self.db, user_id, password_hash, max_len)

    async def validate_password_not_reused(self, user_id: UUID, plain_password: str) -> None:
        """
        Purpose: Validate that a proposed password does not violate history reuse policies.
        Raises: PasswordHistoryViolation
        """
        history = await self.password_repo.get_history(self.db, user_id)
        for old_hash in history:
            try:
                # Argon2 password verification
                if self.password_hasher.verify_password(plain_password, old_hash):
                    raise PasswordHistoryViolation("Cannot reuse a previously used password.")
            except PasswordHistoryViolation as e:
                raise e
            except Exception as e:
                logger.error(f"Error during password history verify: {e}")
                continue

    async def clear_history(self, user_id: UUID) -> None:
        """
        Purpose: Clear a user's entire password history (e.g. on account reset).
        """
        await self.password_repo.clear_history(self.db, user_id)
