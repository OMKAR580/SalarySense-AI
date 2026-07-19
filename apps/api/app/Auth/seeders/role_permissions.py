from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.role import Role
from app.Auth.models.permission import Permission
from app.Auth.models.role_permission import RolePermission

class RolePermissionSeeder(BaseSeeder):
    async def run(self) -> None:
        # Load all roles
        roles_result = await self.session.execute(select(Role))
        roles_map = {r.name: r for r in roles_result.scalars()}
        
        # Load all permissions
        perms_result = await self.session.execute(select(Permission))
        perms_map = {f"{p.resource}.{p.action}": p for p in perms_result.scalars()}
        
        # Define mappings
        # We can dynamically map Super Admin to everything
        all_perms = list(perms_map.keys())
        
        admin_perms = [p for p in all_perms if not p.startswith("system.")]
        
        support_perms = [
            "users.read", "users.block",
            "sessions.read", "sessions.revoke",
            "devices.read", "devices.remove",
            "audit.read"
        ]
        
        moderator_perms = [
            "users.read", "users.block"
        ]
        
        customer_perms = [
            "self.read", "self.update", "self.delete",
            "self.sessions.revoke", "self.devices.remove"
        ]
        
        mappings = {
            "Super Admin": all_perms,
            "Admin": admin_perms,
            "Manager": admin_perms,
            "Developer": ["apikeys.create", "apikeys.read", "apikeys.rotate", "apikeys.revoke"],
            "Support": support_perms,
            "Moderator": moderator_perms,
            "Customer": customer_perms,
            "Employee": customer_perms,
            "Student": customer_perms,
            "Teacher": customer_perms,
            "Guest": ["self.read"]
        }
        
        for role_name, perm_list in mappings.items():
            role = roles_map.get(role_name)
            if not role:
                self.logger.warning(f"Role '{role_name}' not found. Skipping permission mapping.")
                continue
                
            for perm_str in perm_list:
                perm = perms_map.get(perm_str)
                if not perm:
                    self.logger.warning(f"Permission '{perm_str}' not found. Skipping.")
                    continue
                
                # Check if mapping already exists
                stmt = select(RolePermission).where(
                    RolePermission.role_id == role.id,
                    RolePermission.permission_id == perm.id
                )
                result = await self.session.execute(stmt)
                existing = result.scalar_one_or_none()
                
                if not existing:
                    role_perm = RolePermission(role_id=role.id, permission_id=perm.id)
                    self.session.add(role_perm)
                    self.logger.info(f"Assigned '{perm_str}' to '{role_name}'")
