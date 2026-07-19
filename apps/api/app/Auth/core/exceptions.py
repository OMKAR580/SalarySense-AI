from typing import Any, Dict, Optional
from fastapi import HTTPException, status

class AppException(HTTPException):
    """
    Base class for application specific exceptions.
    """
    def __init__(
        self,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        detail: Any = None,
        headers: Optional[Dict[str, str]] = None,
    ) -> None:
        super().__init__(status_code=status_code, detail=detail, headers=headers)

class NotFoundException(AppException):
    def __init__(self, detail: Any = "Resource not found"):
        super().__init__(status_code=status.HTTP_404_NOT_FOUND, detail=detail)

class UnauthorizedException(AppException):
    def __init__(self, detail: Any = "Unauthorized"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class ForbiddenException(AppException):
    def __init__(self, detail: Any = "Forbidden"):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail)

class ValidationException(AppException):
    def __init__(self, detail: Any = "Validation error"):
        super().__init__(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=detail)

# Security Exceptions (Domain Exceptions, NOT HTTP Exceptions)
class SecurityException(Exception):
    """Base security exception."""
    pass

class InvalidPassword(SecurityException):
    pass

class WeakPassword(SecurityException):
    pass

class InvalidToken(SecurityException):
    pass

class ExpiredToken(SecurityException):
    pass

class SecretMissing(SecurityException):
    pass

class HashFailure(SecurityException):
    pass

class EncryptionFailure(SecurityException):
    pass

class SecurityViolation(SecurityException):
    pass
