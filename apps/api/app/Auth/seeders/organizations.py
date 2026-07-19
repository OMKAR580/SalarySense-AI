from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.organization import Organization

class OrganizationSeeder(BaseSeeder):
    async def run(self) -> None:
        organizations = [
            {"name": "System", "slug": "system"},
            {"name": "Default Workspace", "slug": "default"},
        ]
        
        for org_data in organizations:
            stmt = select(Organization).where(Organization.slug == org_data["slug"])
            result = await self.session.execute(stmt)
            existing_org = result.scalar_one_or_none()
            
            if not existing_org:
                org = Organization(name=org_data["name"], slug=org_data["slug"])
                self.session.add(org)
                self.logger.info(f"Created organization: {org_data['name']}")
            else:
                self.logger.info(f"Organization '{org_data['name']}' already exists.")
