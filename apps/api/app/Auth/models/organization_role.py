from uuid import UUID

from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class OrganizationRole(Base, UUIDMixin, TimestampMixin):
    """
    Tenant-specific roles.
    """
    organization_id: Mapped[UUID] = mapped_column(ForeignKey("organization.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(50))

    # Relationships
    organization: Mapped["Organization"] = relationship(back_populates="roles")
