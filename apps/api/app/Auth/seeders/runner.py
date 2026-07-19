import asyncio
import logging
from typing import List, Type

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.Auth.config.settings import settings
from app.Auth.seeders.base import BaseSeeder

# Import seeders (will be implemented in later steps)
# from app.Auth.seeders.bootstrap import get_all_seeders

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def run_seeders(seeders: List[Type[BaseSeeder]], session: AsyncSession) -> None:
    """
    Run a list of seeders using the provided session.
    Transactions are handled globally in the runner, or individually if preferred.
    We will wrap the entire bootstrap in a single transaction that commits at the end,
    or we can let each seeder commit as needed. To avoid partial failures leaving
    corrupt data, we commit after all seeders successfully execute.
    """
    logger.info("Starting database seeding process...")
    try:
        for seeder_cls in seeders:
            logger.info(f"Running seeder: {seeder_cls.__name__}")
            seeder = seeder_cls(session)
            await seeder.run()
            
        await session.commit()
        logger.info("Database seeding completed successfully.")
    except Exception as e:
        await session.rollback()
        logger.error(f"Seeding failed! Transaction rolled back. Error: {e}")
        raise

async def main() -> None:
    # Use the DB URI from settings. 
    # For local seeding against the dev SQLite DB, we can default or override it.
    engine = create_async_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
    
    # We will import get_all_seeders from bootstrap when it's ready.
    from app.Auth.seeders.bootstrap import get_all_seeders
    seeders = get_all_seeders()
    
    async with async_session() as session:
        await run_seeders(seeders, session)
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
