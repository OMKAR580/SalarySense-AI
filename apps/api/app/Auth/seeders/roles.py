from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.role import Role

class RoleSeeder(BaseSeeder):
    async def run(self) -> None:
        roles = [
            {"name": "Super Admin", "description": "Full access to all system features and settings.", "is_system": True},
            {"name": "Admin", "description": "Administrative access to most features.", "is_system": True},
            {"name": "Manager", "description": "Can manage users and standard resources.", "is_system": True},
            {"name": "Developer", "description": "Access to API keys and developer tools.", "is_system": True},
            {"name": "Support", "description": "Read-only access for troubleshooting and basic support actions.", "is_system": True},
            {"name": "Moderator", "description": "Can moderate user-generated content and flagged accounts.", "is_system": True},
            {"name": "Teacher", "description": "Educational platform role.", "is_system": False},
            {"name": "Student", "description": "Standard student role.", "is_system": False},
            {"name": "Employee", "description": "Standard employee access.", "is_system": False},
            {"name": "Customer", "description": "Standard customer role with self-management permissions.", "is_system": True},
            {"name": "Guest", "description": "Limited read-only access.", "is_system": True},
        ]
        
        for role_data in roles:
            stmt = select(Role).where(Role.name == role_data["name"])
            result = await self.session.execute(stmt)
            existing_role = result.scalar_one_or_none()
            
            if not existing_role:
                role = Role(
                    name=role_data["name"], 
                    description=role_data["description"],
                    is_system=role_data["is_system"]
                )
                self.session.add(role)
                self.logger.info(f"Created role: {role_data['name']}")
            else:
                self.logger.info(f"Role '{role_data['name']}' already exists.")
