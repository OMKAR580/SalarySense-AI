from uuid import UUID
from datetime import datetime
from typing import Optional

from sqlalchemy import ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import TimestampMixin


class UserRole(Base, TimestampMixin):
    """
    Association table mapping users to roles.
    """
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
    role_id: Mapped[UUID] = mapped_column(ForeignKey("role.id", ondelete="CASCADE"), primary_key=True)
    assigned_by: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
