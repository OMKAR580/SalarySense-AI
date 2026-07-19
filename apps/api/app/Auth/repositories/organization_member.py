from typing import Any
from app.Auth.models.organization_member import OrganizationMember
from app.Auth.repositories.base import BaseRepository

class OrganizationMemberRepository(BaseRepository[OrganizationMember, Any, Any]):
    def __init__(self):
        super().__init__(OrganizationMember)

organization_member_repository = OrganizationMemberRepository()