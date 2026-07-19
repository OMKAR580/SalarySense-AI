import json
import logging
from datetime import datetime, timezone
from typing import Any

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        # Include custom extra fields if present
        for field in ["event", "user", "ip", "request_id"]:
            if hasattr(record, field):
                log_data[field] = getattr(record, field)
        
        # Include exception context
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data)

def setup_logging() -> None:
    """
    Sets up JSON structured logging globally.
    """
    root_logger = logging.getLogger()
    
    # Avoid duplicate setups
    if root_logger.handlers:
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)
            
    handler = logging.StreamHandler()
    handler.setFormatter(JSONFormatter())
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)
