import logging
import sys
from app.Auth.core.logging import setup_logging

def setup_app_logging() -> None:
    """
    Redirect logging to the production JSON structured logging system.
    """
    setup_logging()

def log_security_event(event_type: str, user_id: str, details: str) -> None:
    """
    Centralized security event logging mapping to JSON formatter.
    """
    logging.getLogger("security").info(
        f"Security Event: {event_type} - {details}", 
        extra={"event": event_type, "user": user_id}
    )
