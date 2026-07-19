from abc import ABC, abstractmethod
from app.Auth.config.jwt_settings import jwt_config

class KeyManager(ABC):
    @abstractmethod
    def get_signing_key(self) -> str:
        pass
        
    @abstractmethod
    def get_verifying_key(self) -> str:
        pass

class SharedSecretKeyManager(KeyManager):
    def __init__(self, secret: str = jwt_config.jwt_secret_key):
        self.secret = secret
        
    def get_signing_key(self) -> str:
        return self.secret
        
    def get_verifying_key(self) -> str:
        return self.secret
