from typing import Optional
from uuid import UUID

from sqlalchemy import String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class OAuthAccount(Base, UUIDMixin, TimestampMixin):
    """
    Links third-party social accounts to a user.
    """
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    provider: Mapped[str] = mapped_column(String(50), index=True)
    provider_account_id: Mapped[str] = mapped_column(String(255))
    access_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    refresh_token: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    __table_args__ = (
        UniqueConstraint('provider', 'provider_account_id', name='uix_oauth_provider_account'),
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="oauth_accounts")
