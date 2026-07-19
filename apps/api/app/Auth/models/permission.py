from typing import List

from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class Permission(Base, UUIDMixin, TimestampMixin):
    """
    Defines granular system permissions.
    """
    resource: Mapped[str] = mapped_column(String(50))
    action: Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(String(255))

    __table_args__ = (
        UniqueConstraint('resource', 'action', name='uix_permission_resource_action'),
    )

    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        secondary="rolepermission", back_populates="permissions"
    )
