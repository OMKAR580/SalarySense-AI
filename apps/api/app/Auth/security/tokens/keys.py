from typing import Protocol, Optional
from dataclasses import dataclass

@dataclass
class KeyInformation:
    kid: str
    alg: str
    kty: str
    use: str
    key_material: str

class KeyResolver(Protocol):
    def get_key(self, kid: Optional[str], alg: str, issuer: Optional[str] = None) -> KeyInformation:
        ...
