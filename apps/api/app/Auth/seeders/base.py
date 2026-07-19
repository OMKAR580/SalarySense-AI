import logging
from abc import ABC, abstractmethod

from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

class BaseSeeder(ABC):
    """
    Abstract base class for all database seeders.
    Ensures that every seeder implements an asynchronous run() method.
    """

    def __init__(self, session: AsyncSession):
        self.session = session
        self.logger = logger

    @abstractmethod
    async def run(self) -> None:
        """
        Execute the seeding logic. This method must be idempotent.
        """
        pass
