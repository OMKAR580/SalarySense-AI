from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class TrustedDevice(Base, UUIDMixin, TimestampMixin):
    """
    Devices that bypass strict 2FA requirements.
    """
    device_id: Mapped[UUID] = mapped_column(ForeignKey("device.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    trusted_until: Mapped[datetime] = mapped_column(DateTime)

    # Relationships
    device: Mapped["Device"] = relationship(back_populates="trusted_devices")
    user: Mapped["User"] = relationship()
