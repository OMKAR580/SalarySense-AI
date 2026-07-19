from abc import ABC, abstractmethod
from typing import Any, Dict
from app.Auth.auth.context import AuthenticationContext
from app.Auth.auth.result import AuthenticationResult

class AuthenticationStrategy(ABC):
    """
    Purpose: Abstract contract for authentication methods (Password, OAuth, Passkey, etc.).
    Architecture Notes: Must be thread-safe/singleton-ready.
    """
    
    @abstractmethod
    def supports(self, provider_name: str) -> bool:
        pass

    @abstractmethod
    def prepare(self, context: AuthenticationContext, credentials: Any) -> None:
        pass

    @abstractmethod
    def validate(self, context: AuthenticationContext, credentials: Any) -> bool:
        pass
        
    @abstractmethod
    def authenticate(self, context: AuthenticationContext, credentials: Any) -> AuthenticationResult:
        pass

    @abstractmethod
    def cleanup(self, context: AuthenticationContext) -> None:
        pass

class PasswordStrategy(AuthenticationStrategy):
    """
    Purpose: Concrete skeleton for Password-based authentication.
    """
    def supports(self, provider_name: str) -> bool:
        return provider_name.lower() == "password"

    def prepare(self, context: AuthenticationContext, credentials: Any) -> None:
        pass

    def validate(self, context: AuthenticationContext, credentials: Any) -> bool:
        # Placeholder
        return True

    def authenticate(self, context: AuthenticationContext, credentials: Any) -> AuthenticationResult:
        raise NotImplementedError("Future phase: Password authentication logic")

    def cleanup(self, context: AuthenticationContext) -> None:
        pass
