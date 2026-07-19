from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class ApiKey(Base, UUIDMixin, TimestampMixin):
    """
    M2M API keys.
    """
    organization_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("organization.id", ondelete="CASCADE"), index=True, nullable=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    key_hash: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    prefix: Mapped[str] = mapped_column(String(20))
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    organization: Mapped[Optional["Organization"]] = relationship(back_populates="api_keys")
    # Note: User relationship assumes future expansion of the User model to back_populate.
