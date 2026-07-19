from uuid import UUID
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class OrganizationMember(Base, UUIDMixin, TimestampMixin):
    """
    Links users to organizations.
    """
    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organization.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), index=True)
    role_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("role.id", ondelete="SET NULL"), nullable=True)
    invited_by: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="active")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="members")
    user: Mapped["User"] = relationship(back_populates="organization_members", foreign_keys="[OrganizationMember.user_id]")
    role: Mapped[Optional["Role"]] = relationship(foreign_keys="[OrganizationMember.role_id]")
