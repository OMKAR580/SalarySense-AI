from typing import List, Optional
from uuid import UUID

from sqlalchemy import String, Index, ForeignKey, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin


class Organization(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Root entities for SaaS tenants.
    """
    name: Mapped[str] = mapped_column(String(255))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    owner_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    __table_args__ = (
        Index('ix_organization_deleted_at', 'deleted_at'),
    )

    # Relationships
    members: Mapped[List["OrganizationMember"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    roles: Mapped[List["OrganizationRole"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
    api_keys: Mapped[List["ApiKey"]] = relationship(
        back_populates="organization", cascade="all, delete-orphan"
    )
