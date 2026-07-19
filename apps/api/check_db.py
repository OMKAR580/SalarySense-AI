import asyncio
from app.Auth.database.session import async_session_maker
from app.Auth.repositories.oauth import oauth_provider_config_repository as repo

async def main():
    async with async_session_maker() as session:
        config = await repo.get_by_name(session, 'google')
        print("DB Client ID:", config.client_id if config else None)

asyncio.run(main())
