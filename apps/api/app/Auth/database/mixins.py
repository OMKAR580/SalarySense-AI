import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime
from sqlalchemy.dialects.postgresql import UUID


class UUIDMixin:
    """
    Adds a UUID primary key to a model.
    """
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True,
        nullable=False,
    )


class TimestampMixin:
    """
    Adds created_at and updated_at timestamps to a model.
    """
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )


class SoftDeleteMixin:
    """
    Adds a deleted_at timestamp for soft deletions.
    """
    deleted_at = Column(DateTime, nullable=True, default=None)

