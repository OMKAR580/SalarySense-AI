from enum import Enum

class IdentityStatus(str, Enum):
    ACTIVE = "active"
    PENDING = "pending"
    LOCKED = "locked"
    DISABLED = "disabled"
    DELETED = "deleted"
    SUSPENDED = "suspended"
    INVITED = "invited"
    UNVERIFIED = "unverified"
    ARCHIVED = "archived"
