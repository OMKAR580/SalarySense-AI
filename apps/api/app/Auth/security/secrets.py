import os
from typing import Optional
from app.Auth.config.settings import settings

class SecretManager:
    """
    Purpose: Read secrets securely from environment or settings.
    Security Notes: Never hardcode secrets. Supports rotation-ready design.
    """
    
    @classmethod
    def get_secret(cls, key_name: str) -> Optional[str]:
        """
        Purpose: Retrieve a secret.
        Arguments: key_name (str)
        Returns: Optional[str]
        Raises: None
        """
        # 1. Try to get from environment first
        val = os.getenv(key_name)
        if val is not None:
            return val
            
        # 2. Try settings
        if hasattr(settings, key_name):
            return getattr(settings, key_name)
            
        return None

    @classmethod
    def require_secret(cls, key_name: str) -> str:
        """
        Purpose: Retrieve a required secret.
        Arguments: key_name (str)
        Returns: str
        Raises: ValueError (mapped to SecretMissing later)
        """
        val = cls.get_secret(key_name)
        if val is None:
            from app.Auth.core.exceptions import SecretMissing
            raise SecretMissing(f"Required secret {key_name} is missing.")
        return val
