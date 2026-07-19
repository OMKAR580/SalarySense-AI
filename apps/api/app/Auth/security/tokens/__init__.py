from datetime import datetime, timedelta, timezone
from typing import Optional
from app.Auth.security.random import (
    generate_urlsafe_token,
    generate_hex_token,
    generate_base64_token,
    generate_uuid_token,
    generate_numeric_otp
)
from app.Auth.security.models import TokenMetadata

def create_urlsafe_token(length: int = 32, expires_in_minutes: Optional[int] = None, token_type: str = "generic") -> TokenMetadata:
    """
    Purpose: Create a URL-safe token with metadata.
    Arguments: length, expires_in_minutes, token_type
    Returns: TokenMetadata
    """
    token = generate_urlsafe_token(length)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes) if expires_in_minutes else None
    return TokenMetadata(token=token, expires_at=expires_at, token_type=token_type)

def create_hex_token(length: int = 32, expires_in_minutes: Optional[int] = None, token_type: str = "generic") -> TokenMetadata:
    """
    Purpose: Create a Hex token with metadata.
    Arguments: length, expires_in_minutes, token_type
    Returns: TokenMetadata
    """
    token = generate_hex_token(length)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes) if expires_in_minutes else None
    return TokenMetadata(token=token, expires_at=expires_at, token_type=token_type)

def create_numeric_otp(length: int = 6, expires_in_minutes: Optional[int] = None, token_type: str = "otp") -> TokenMetadata:
    """
    Purpose: Create an OTP with metadata.
    Arguments: length, expires_in_minutes, token_type
    Returns: TokenMetadata
    """
    token = generate_numeric_otp(length)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=expires_in_minutes) if expires_in_minutes else None
    return TokenMetadata(token=token, expires_at=expires_at, token_type=token_type)
