from datetime import datetime
from uuid import UUID
from typing import Optional

from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class Session(Base, UUIDMixin, TimestampMixin):
    """
    Active server-side sessions.
    """
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    device_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("device.id", ondelete="CASCADE"), index=True, nullable=True)
    session_token_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="sessions")
    device: Mapped[Optional["Device"]] = relationship(back_populates="sessions")
