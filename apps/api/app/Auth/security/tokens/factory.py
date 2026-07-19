from typing import Dict, Any, Optional
from app.Auth.security.tokens.provider import TokenProvider
from app.Auth.security.tokens.exceptions import ProviderUnavailable

class TokenFactory:
    def __init__(self):
        self._providers: Dict[str, TokenProvider] = {}
        
    def register_provider(self, token_type: str, provider: TokenProvider):
        self._providers[token_type] = provider
        
    def _get_provider(self, token_type: str) -> TokenProvider:
        provider = self._providers.get(token_type)
        if not provider:
            raise ProviderUnavailable(f"No provider registered for token type: {token_type}")
        return provider

    def create_token(self, subject: str, token_type: str, custom_claims: Optional[Dict[str, Any]] = None) -> Any:
        provider = self._get_provider(token_type)
        return provider.create_token(subject, token_type, custom_claims)
        
    def validate_token(self, token: str, token_type: str) -> Any:
        provider = self._get_provider(token_type)
        return provider.validate_token(token, expected_type=token_type)
