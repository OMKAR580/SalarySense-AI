from typing import Protocol, List
from app.Auth.auth.identity.models import Identity
from app.Auth.auth.identity.policy import IdentityPolicy
from app.Auth.auth.identity.exceptions import IdentityValidationFailed

class IdentityValidator(Protocol):
    async def validate(self, identity: Identity) -> bool: ...

class PipelineIdentityValidator(IdentityValidator):
    def __init__(self, policies: List[IdentityPolicy]):
        self.policies = policies
        
    async def validate(self, identity: Identity) -> bool:
        for policy in self.policies:
            try:
                policy.enforce(identity)
            except IdentityValidationFailed:
                raise
        return True
