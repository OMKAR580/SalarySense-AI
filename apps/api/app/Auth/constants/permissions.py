from enum import Enum

class PermissionName(str, Enum):
    """Enumeration of system permissions."""
    READ_USERS = "read:users"
    WRITE_USERS = "write:users"
    DELETE_USERS = "delete:users"
    MANAGE_ROLES = "manage:roles"
