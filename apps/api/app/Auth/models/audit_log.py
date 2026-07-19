from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin


class AuditLog(Base, UUIDMixin):
    """
    Tracks sensitive modifications.
    """
    actor_id: Mapped[Optional[UUID]] = mapped_column(ForeignKey("user.id", ondelete="SET NULL"), index=True, nullable=True)
    target_id: Mapped[Optional[UUID]] = mapped_column(index=True, nullable=True)
    action: Mapped[str] = mapped_column(String(100))
    entity: Mapped[str] = mapped_column(String(100))
    changes: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    actor: Mapped[Optional["User"]] = relationship(back_populates="audit_logs")
