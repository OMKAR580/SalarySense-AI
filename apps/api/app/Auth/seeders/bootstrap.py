from typing import List, Type
from app.Auth.seeders.base import BaseSeeder
from app.Auth.seeders.roles import RoleSeeder
from app.Auth.seeders.permissions import PermissionSeeder
from app.Auth.seeders.role_permissions import RolePermissionSeeder
from app.Auth.seeders.organizations import OrganizationSeeder
from app.Auth.seeders.system_settings import SystemSettingSeeder
from app.Auth.seeders.oauth_providers import OAuthProviderSeeder

def get_all_seeders() -> List[Type[BaseSeeder]]:
    """
    Returns the list of seeders in the correct dependency order.
    For example, Roles and Permissions must exist before RolePermissions can be mapped.
    """
    return [
        RoleSeeder,
        PermissionSeeder,
        RolePermissionSeeder,
        OrganizationSeeder,
        SystemSettingSeeder,
        OAuthProviderSeeder,
    ]
