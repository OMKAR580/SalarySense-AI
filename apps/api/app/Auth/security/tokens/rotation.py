from dataclasses import dataclass
from typing import List, Optional
from uuid import UUID
from datetime import datetime

@dataclass
class RotationMetadata:
    rotated_at: datetime
    ip_address: str
    reason: str

@dataclass
class TokenFamily:
    family_id: UUID
    root_jti: str
    is_revoked: bool
    created_at: datetime

@dataclass
class RotationChain:
    parent_jti: str
    child_jti: str
    family_id: UUID
    metadata: RotationMetadata

class RotationEngineInterface:
    def detect_reuse(self, jti: str, family_id: UUID) -> bool:
        raise NotImplementedError
        
    def revoke_family(self, family_id: UUID) -> None:
        raise NotImplementedError
        
    def record_rotation(self, parent_jti: str, child_jti: str, family_id: UUID) -> None:
        raise NotImplementedError
