from enum import Enum

class RoleName(str, Enum):
    """Enumeration of system roles."""
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"
