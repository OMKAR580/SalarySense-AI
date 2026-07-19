from typing import Any
from app.Auth.models.api_key import ApiKey
from app.Auth.repositories.base import BaseRepository

class ApiKeyRepository(BaseRepository[ApiKey, Any, Any]):
    def __init__(self):
        super().__init__(ApiKey)

api_key_repository = ApiKeyRepository()