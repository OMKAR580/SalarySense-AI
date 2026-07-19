from sqlalchemy import select
from app.Auth.seeders.base import BaseSeeder
from app.Auth.models.oauth_provider_config import OAuthProviderConfig

class OAuthProviderSeeder(BaseSeeder):
    async def run(self) -> None:
        providers = [
            {"name": "google", "display_name": "Google", "is_enabled": True},
            {"name": "github", "display_name": "GitHub", "is_enabled": True},
            {"name": "facebook", "display_name": "Facebook", "is_enabled": False},
            {"name": "apple", "display_name": "Apple", "is_enabled": False},
        ]
        
        for p_data in providers:
            stmt = select(OAuthProviderConfig).where(OAuthProviderConfig.name == p_data["name"])
            result = await self.session.execute(stmt)
            existing = result.scalar_one_or_none()
            
            if not existing:
                provider = OAuthProviderConfig(
                    name=p_data["name"],
                    display_name=p_data["display_name"],
                    is_enabled=p_data["is_enabled"]
                )
                self.session.add(provider)
                self.logger.info(f"Created OAuth Provider: {p_data['name']}")
            else:
                self.logger.info(f"OAuth Provider '{p_data['name']}' already exists.")
