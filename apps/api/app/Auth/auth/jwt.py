"""
JWT interface.
TODO: Implement JSON Web Token generation, decoding, and validation.
"""

def create_jwt(subject: str, expires_delta: int = None) -> str:
    """Create a new JWT token."""
    pass

def decode_jwt(token: str) -> dict:
    """Decode a JWT token and extract the payload."""
    pass
