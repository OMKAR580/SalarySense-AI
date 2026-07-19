from typing import List

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class Role(Base, UUIDMixin, TimestampMixin):
    """
    Defines system or tenant-level roles.
    """
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    description: Mapped[str | None] = mapped_column(String(255))
    is_system: Mapped[bool] = mapped_column(Boolean, default=False)

    users: Mapped[List["User"]] = relationship(
        secondary="userrole",
        primaryjoin="Role.id == UserRole.role_id",
        secondaryjoin="User.id == UserRole.user_id",
        back_populates="roles"
    )
    permissions: Mapped[List["Permission"]] = relationship(
        secondary="rolepermission", back_populates="roles"
    )
