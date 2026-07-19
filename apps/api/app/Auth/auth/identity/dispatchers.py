from app.Auth.auth.identity.events import (
    IdentityResolved, IdentityCacheMiss, IdentityLoaded
)
from datetime import datetime

class IdentityEventDispatcher:
    def dispatch_lookup_started(self, identifier: str) -> None:
        pass
        
    def dispatch_resolved(self, identity_id: str, resolved_by: str) -> None:
        event = IdentityResolved(identity_id=identity_id, timestamp=datetime.now(), resolved_by=resolved_by)
        # Publish event
        
    def dispatch_cache_miss(self, identity_id: str) -> None:
        pass
