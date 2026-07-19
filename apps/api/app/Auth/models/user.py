from datetime import datetime
from typing import List, Optional

from sqlalchemy import String, Boolean, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin, SoftDeleteMixin


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Central identity table storing core user information.
    """
    email: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    username: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), unique=True, index=True, nullable=True)
    password_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    avatar: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    __table_args__ = (
        Index('ix_user_deleted_at', 'deleted_at'),
    )

    # Relationships
    roles: Mapped[List["Role"]] = relationship(
        secondary="userrole",
        primaryjoin="User.id == UserRole.user_id",
        secondaryjoin="Role.id == UserRole.role_id",
        back_populates="users",
        lazy="selectin"
    )
    oauth_accounts: Mapped[List["OAuthAccount"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    password_reset_tokens: Mapped[List["PasswordResetToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    email_verification_tokens: Mapped[List["EmailVerificationToken"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    devices: Mapped[List["Device"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    sessions: Mapped[List["Session"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    two_factor_methods: Mapped[List["TwoFactorMethod"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    backup_codes: Mapped[List["BackupCode"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    login_history: Mapped[List["LoginHistory"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship(
        back_populates="actor"
    )
    organization_members: Mapped[List["OrganizationMember"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", foreign_keys="[OrganizationMember.user_id]"
    )
    organizations: Mapped[List["Organization"]] = relationship(
        secondary="organizationmember",
        primaryjoin="User.id == OrganizationMember.user_id",
        secondaryjoin="Organization.id == OrganizationMember.organization_id",
        viewonly=True
    )
