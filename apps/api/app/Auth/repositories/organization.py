from typing import Any
from app.Auth.models.organization import Organization
from app.Auth.repositories.base import BaseRepository

class OrganizationRepository(BaseRepository[Organization, Any, Any]):
    def __init__(self):
        super().__init__(Organization)

organization_repository = OrganizationRepository()