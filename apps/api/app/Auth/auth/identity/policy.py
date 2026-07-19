from typing import Protocol
from app.Auth.auth.identity.models import Identity
from app.Auth.auth.identity.exceptions import IdentityValidationFailed
from app.Auth.auth.identity.states import IdentityStatus

class IdentityPolicy(Protocol):
    def enforce(self, identity: Identity) -> None: ...

class AccountEnabledPolicy(IdentityPolicy):
    def enforce(self, identity: Identity) -> None:
        if identity.status == IdentityStatus.DISABLED:
            raise IdentityValidationFailed("Account is disabled.")
        if identity.status == IdentityStatus.LOCKED:
            raise IdentityValidationFailed("Account is locked.")
        if identity.status == IdentityStatus.DELETED:
            raise IdentityValidationFailed("Account is deleted.")

class EmailVerifiedPolicy(IdentityPolicy):
    def enforce(self, identity: Identity) -> None:
        if identity.status == IdentityStatus.UNVERIFIED:
            raise IdentityValidationFailed("Email is unverified.")
