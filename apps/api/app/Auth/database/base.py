# Import all the models here so that Alembic can discover them.
from app.Auth.database.base_class import Base  # noqa

# Core
from app.Auth.models.user import User  # noqa
from app.Auth.models.role import Role  # noqa
from app.Auth.models.permission import Permission  # noqa
from app.Auth.models.user_role import UserRole  # noqa
from app.Auth.models.role_permission import RolePermission  # noqa

# Auth & Tokens
from app.Auth.models.oauth_account import OAuthAccount  # noqa
from app.Auth.models.session import Session  # noqa
from app.Auth.models.refresh_token import RefreshToken  # noqa
from app.Auth.models.password_reset_token import PasswordResetToken  # noqa
from app.Auth.models.email_verification_token import EmailVerificationToken  # noqa

# Security
from app.Auth.models.device import Device  # noqa
from app.Auth.models.trusted_device import TrustedDevice  # noqa
from app.Auth.models.login_history import LoginHistory  # noqa
from app.Auth.models.two_factor_method import TwoFactorMethod  # noqa
from app.Auth.models.backup_code import BackupCode  # noqa
from app.Auth.models.audit_log import AuditLog  # noqa
from app.Auth.models.system_setting import SystemSetting  # noqa
from app.Auth.models.oauth_provider_config import OAuthProviderConfig  # noqa

# Future Ready
from app.Auth.models.organization import Organization  # noqa
from app.Auth.models.organization_member import OrganizationMember  # noqa
from app.Auth.models.organization_role import OrganizationRole  # noqa
from app.Auth.models.api_key import ApiKey  # noqa
