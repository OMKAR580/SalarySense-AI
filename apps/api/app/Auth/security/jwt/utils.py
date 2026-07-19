import hashlib
import uuid
from typing import Optional

def generate_jti() -> str:
    return str(uuid.uuid4())

def parse_bearer_token(auth_header: str, prefix: str = "Bearer") -> Optional[str]:
    if not auth_header:
        return None
    parts = auth_header.split()
    if len(parts) == 2 and parts[0].lower() == prefix.lower():
        return parts[1]
    return None

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode('utf-8')).hexdigest()
