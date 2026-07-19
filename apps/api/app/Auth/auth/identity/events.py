from dataclasses import dataclass
from uuid import UUID
from datetime import datetime

@dataclass
class IdentityEvent:
    identity_id: UUID
    timestamp: datetime

@dataclass
class IdentityResolved(IdentityEvent):
    resolved_by: str

@dataclass
class IdentityLoaded(IdentityEvent):
    cache_hit: bool

@dataclass
class IdentityValidated(IdentityEvent):
    pass

@dataclass
class IdentityLocked(IdentityEvent):
    reason: str

@dataclass
class IdentityDisabled(IdentityEvent):
    reason: str

@dataclass
class IdentityDeleted(IdentityEvent):
    pass

@dataclass
class IdentityUpdated(IdentityEvent):
    fields_changed: list[str]
