from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.system_setting import SystemSetting

class SystemSettingSeeder(BaseSeeder):
    async def run(self) -> None:
        settings = [
            {"key": "auth.password_policy", "value": {"min_length": 12, "require_uppercase": True, "require_numbers": True, "require_symbols": True}, "description": "Global password complexity policy"},
            {"key": "auth.max_login_attempts", "value": 5, "description": "Maximum failed login attempts before account lock"},
            {"key": "auth.account_lock_duration_minutes", "value": 30, "description": "Duration to lock account after max failed attempts"},
            {"key": "auth.session_lifetime_hours", "value": 24, "description": "Default web session lifetime"},
            {"key": "auth.refresh_token_lifetime_days", "value": 30, "description": "Refresh token validity period"},
            {"key": "auth.remember_device_days", "value": 30, "description": "How long a device is trusted when 'Remember Me' is checked"},
            {"key": "auth.require_email_verification", "value": True, "description": "Require users to verify email before login"},
            {"key": "auth.mfa_enabled_default", "value": False, "description": "Is MFA required for all new accounts by default?"},
            {"key": "system.default_language", "value": "en-US", "description": "Default system language"},
            {"key": "system.default_timezone", "value": "UTC", "description": "Default system timezone"},
            {"key": "auth.password_history_count", "value": 3, "description": "Number of previous passwords to remember and prevent reuse"},
        ]
        
        for s_data in settings:
            stmt = select(SystemSetting).where(SystemSetting.key == s_data["key"])
            result = await self.session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if not existing:
                setting = SystemSetting(
                    key=s_data["key"],
                    value=s_data["value"],
                    description=s_data["description"]
                )
                self.session.add(setting)
                self.logger.info(f"Created setting: {s_data['key']}")
            else:
                self.logger.info(f"Setting '{s_data['key']}' already exists.")
