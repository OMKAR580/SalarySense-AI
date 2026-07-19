from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy import String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class Device(Base, UUIDMixin, TimestampMixin):
    """
    Tracks devices used by the user.
    """
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    device_identifier: Mapped[str] = mapped_column(String(255))
    device_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    os: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    browser: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_ip: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    last_active: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'device_identifier', name='uix_user_device'),
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="devices")
    sessions: Mapped[List["Session"]] = relationship(back_populates="device", cascade="all, delete-orphan")
    trusted_devices: Mapped[List["TrustedDevice"]] = relationship(back_populates="device", cascade="all, delete-orphan")
