
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.Auth.database.base_class import Base
from app.Auth.database.mixins import UUIDMixin, TimestampMixin


class OAuthProviderConfig(Base, UUIDMixin, TimestampMixin):
    """
    Supported OAuth providers and their configuration status.
    """
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    display_name: Mapped[str] = mapped_column(String(100))
    is_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    client_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    authorization_endpoint: Mapped[str | None] = mapped_column(String(255), nullable=True)
    token_endpoint: Mapped[str | None] = mapped_column(String(255), nullable=True)
