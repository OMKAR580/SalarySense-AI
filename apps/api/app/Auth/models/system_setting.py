from typing import Any

from sqlalchemy import String, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class SystemSetting(Base, UUIDMixin, TimestampMixin):
    """
    Global system configurations such as Password Policy, Session Lifetime, etc.
    """
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[Any] = mapped_column(JSON)
    description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
