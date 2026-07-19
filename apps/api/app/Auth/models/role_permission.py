from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import TimestampMixin


class RolePermission(Base, TimestampMixin):
    """
    Association table mapping roles to permissions.
    """
    role_id: Mapped[UUID] = mapped_column(ForeignKey("role.id", ondelete="CASCADE"), primary_key=True)
    permission_id: Mapped[UUID] = mapped_column(ForeignKey("permission.id", ondelete="CASCADE"), primary_key=True)
