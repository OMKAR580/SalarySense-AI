from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.permission import Permission

class PermissionSeeder(BaseSeeder):
    async def run(self) -> None:
        # A robust enterprise permission catalog grouped by resource
        permissions = [
            # Users
            {"resource": "users", "action": "create", "description": "Create new users"},
            {"resource": "users", "action": "read", "description": "View user details"},
            {"resource": "users", "action": "update", "description": "Update user profiles"},
            {"resource": "users", "action": "delete", "description": "Delete users (soft or hard)"},
            {"resource": "users", "action": "restore", "description": "Restore soft-deleted users"},
            {"resource": "users", "action": "block", "description": "Block or suspend users"},
            
            # Roles
            {"resource": "roles", "action": "create", "description": "Create new roles"},
            {"resource": "roles", "action": "read", "description": "View roles"},
            {"resource": "roles", "action": "update", "description": "Update role definitions"},
            {"resource": "roles", "action": "delete", "description": "Delete roles"},
            {"resource": "roles", "action": "assign", "description": "Assign roles to users"},
            
            # Permissions
            {"resource": "permissions", "action": "read", "description": "View available permissions"},
            {"resource": "permissions", "action": "assign", "description": "Map permissions to roles"},
            
            # Sessions
            {"resource": "sessions", "action": "read", "description": "View active user sessions"},
            {"resource": "sessions", "action": "revoke", "description": "Revoke active sessions"},
            
            # Devices
            {"resource": "devices", "action": "read", "description": "View trusted devices"},
            {"resource": "devices", "action": "remove", "description": "Remove devices from trusted list"},
            
            # OAuth
            {"resource": "oauth", "action": "manage", "description": "Manage OAuth integrations"},
            
            # Audit Logs
            {"resource": "audit", "action": "read", "description": "View system audit logs"},
            
            # Organizations
            {"resource": "organizations", "action": "create", "description": "Create new organizations"},
            {"resource": "organizations", "action": "read", "description": "View organizations"},
            {"resource": "organizations", "action": "update", "description": "Update organizations"},
            {"resource": "organizations", "action": "delete", "description": "Delete organizations"},
            {"resource": "organizations", "action": "manage", "description": "Manage organization members"},
            
            # API Keys
            {"resource": "apikeys", "action": "create", "description": "Create API keys"},
            {"resource": "apikeys", "action": "read", "description": "View API keys"},
            {"resource": "apikeys", "action": "rotate", "description": "Rotate API keys"},
            {"resource": "apikeys", "action": "revoke", "description": "Revoke API keys"},
            
            # Notifications
            {"resource": "notifications", "action": "manage", "description": "Manage system notifications"},
            
            # System
            {"resource": "system", "action": "settings", "description": "Manage global system settings"},
            
            # Self (Customer / Guest permissions for their own resources)
            {"resource": "self", "action": "read", "description": "View own profile"},
            {"resource": "self", "action": "update", "description": "Update own profile"},
            {"resource": "self", "action": "delete", "description": "Delete own account"},
            {"resource": "self", "action": "sessions.revoke", "description": "Revoke own sessions"},
            {"resource": "self", "action": "devices.remove", "description": "Remove own devices"},
        ]
        
        for perm_data in permissions:
            stmt = select(Permission).where(
                Permission.resource == perm_data["resource"],
                Permission.action == perm_data["action"]
            )
            result = await self.session.execute(stmt)
            existing_perm = result.scalar_one_or_none()
            
            if not existing_perm:
                perm = Permission(
                    resource=perm_data["resource"],
                    action=perm_data["action"],
                    description=perm_data["description"]
                )
                self.session.add(perm)
                self.logger.info(f"Created permission: {perm_data['resource']}.{perm_data['action']}")
            else:
                self.logger.info(f"Permission '{perm_data['resource']}.{perm_data['action']}' already exists.")
