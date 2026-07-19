from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class OAuthProvider(ABC):
    @abstractmethod
    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        """
        Generate redirect URL to the provider's authorization screen.
        """
        pass

    @abstractmethod
    async def exchange_code(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None) -> Dict[str, Any]:
        """
        Exchange authorization code for token payload.
        """
        pass

    @abstractmethod
    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Fetch normalized user profile from the provider.
        """
        pass
