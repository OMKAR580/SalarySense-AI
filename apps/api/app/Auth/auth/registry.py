from typing import Dict, List
from app.Auth.auth.strategy import AuthenticationStrategy
from app.Auth.auth.exceptions import ProviderResolutionError

class ProviderRegistry:
    """
    Purpose: Central registry for discovering and resolving authentication strategies.
    """
    def __init__(self):
        self._strategies: Dict[str, AuthenticationStrategy] = {}

    def register_provider(self, name: str, strategy: AuthenticationStrategy) -> None:
        self._strategies[name.lower()] = strategy

    def unregister_provider(self, name: str) -> None:
        self._strategies.pop(name.lower(), None)

    def list_providers(self) -> List[str]:
        return list(self._strategies.keys())

    def resolve_provider(self, name: str) -> AuthenticationStrategy:
        strategy = self._strategies.get(name.lower())
        if not strategy:
            raise ProviderResolutionError(f"No strategy registered for provider: {name}")
        return strategy
