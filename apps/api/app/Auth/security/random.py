import secrets
import string
import base64
import uuid

def generate_hex_token(length: int = 32) -> str:
    """
    Purpose: Generate a secure random hex token.
    Arguments: length (int)
    Returns: str
    Raises: ValueError if length <= 0
    Security Notes: Uses os.urandom via secrets module.
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    return secrets.token_hex(length // 2 if length % 2 == 0 else (length + 1) // 2)[:length]

def generate_urlsafe_token(length: int = 32) -> str:
    """
    Purpose: Generate a secure url-safe token.
    Arguments: length (int)
    Returns: str
    Raises: ValueError
    Security Notes: Base64 url-safe encoded string.
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    return secrets.token_urlsafe(length)[:length]

def generate_base64_token(length: int = 32) -> str:
    """
    Purpose: Generate a secure base64 token.
    Arguments: length (int)
    Returns: str
    Raises: ValueError
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    raw = secrets.token_bytes(length)
    return base64.b64encode(raw).decode('utf-8')[:length]

def generate_uuid_token() -> str:
    """
    Purpose: Generate a UUIDv4 token.
    Arguments: None
    Returns: str
    Raises: None
    """
    return str(uuid.uuid4())

def generate_numeric_otp(length: int = 6) -> str:
    """
    Purpose: Generate a secure numeric OTP.
    Arguments: length (int)
    Returns: str
    Raises: ValueError
    """
    if length <= 0:
        raise ValueError("Length must be positive")
    return ''.join(secrets.choice(string.digits) for _ in range(length))
