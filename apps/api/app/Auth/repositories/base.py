from typing import Any, Dict, Generic, List, Optional, Type, TypeVar, Union
from uuid import UUID

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.database.base_class import Base

ModelType = TypeVar("ModelType", bound=Base)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    """
    Base Repository with default generic methods for CRUD operations asynchronously.
    """
    def __init__(self, model: Type[ModelType]):
        """
        CRUD object with default methods to Create, Read, Update, Delete (CRUD).
        """
        self.model = model

    async def get_by_id(self, db: AsyncSession, id: Union[int, str, UUID, Any]) -> Optional[ModelType]:
        """
        Purpose: Get a single record by its primary key.
        Arguments:
            db: AsyncSession - The database session
            id: Any - The primary key of the record
        Return Type: Optional[ModelType] - The model instance or None if not found
        Raises: None
        """
        query = select(self.model).filter(self.model.id == id)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_all(self, db: AsyncSession) -> List[ModelType]:
        """
        Purpose: Get all records.
        Arguments:
            db: AsyncSession - The database session
        Return Type: List[ModelType] - List of model instances
        Raises: None
        """
        query = select(self.model)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def create(self, db: AsyncSession, *, obj_in: Union[CreateSchemaType, Dict[str, Any]]) -> ModelType:
        """
        Purpose: Create a new record.
        Arguments:
            db: AsyncSession - The database session
            obj_in: CreateSchemaType | Dict - The data to create the record with
        Return Type: ModelType - The newly created model instance
        Raises: None
        """
        if isinstance(obj_in, dict):
            obj_in_data = obj_in
        else:
            obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def update(
        self,
        db: AsyncSession,
        *,
        db_obj: ModelType,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]]
    ) -> ModelType:
        """
        Purpose: Update an existing record.
        Arguments:
            db: AsyncSession - The database session
            db_obj: ModelType - The existing database object
            obj_in: UpdateSchemaType | Dict - The data to update
        Return Type: ModelType - The updated model instance
        Raises: None
        """
        obj_data = jsonable_encoder(db_obj)
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        for field in obj_data:
            if field in update_data:
                setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        await db.flush()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: Union[int, str, UUID, Any]) -> Optional[ModelType]:
        """
        Purpose: Remove a record by its primary key.
        Arguments:
            db: AsyncSession - The database session
            id: Any - The primary key of the record
        Return Type: Optional[ModelType] - The deleted model instance or None
        Raises: None
        """
        query = select(self.model).filter(self.model.id == id)
        result = await db.execute(query)
        obj = result.scalars().first()
        if obj:
            await db.delete(obj)
            await db.flush()
        return obj

    async def exists(self, db: AsyncSession, *, id: Union[int, str, UUID, Any]) -> bool:
        """
        Purpose: Check if a record exists by its primary key.
        Arguments:
            db: AsyncSession - The database session
            id: Any - The primary key
        Return Type: bool
        Raises: None
        """
        query = select(self.model.id).filter(self.model.id == id)
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def count(self, db: AsyncSession) -> int:
        """
        Purpose: Count total records.
        Arguments:
            db: AsyncSession - The database session
        Return Type: int
        Raises: None
        """
        query = select(func.count(self.model.id))
        result = await db.execute(query)
        return result.scalar_one_or_none() or 0

    async def paginate(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """
        Purpose: Get multiple records with pagination.
        Arguments:
            db: AsyncSession - The database session
            skip: int - Number of records to skip
            limit: int - Max number of records to return
        Return Type: List[ModelType]
        Raises: None
        """
        query = select(self.model).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def search(self, db: AsyncSession, **kwargs) -> List[ModelType]:
        """
        Purpose: Search records by exact field matches.
        Arguments:
            db: AsyncSession - The database session
            kwargs: dict - Field=Value pairs to filter by
        Return Type: List[ModelType]
        Raises: None
        """
        query = select(self.model)
        for key, value in kwargs.items():
            if hasattr(self.model, key):
                query = query.filter(getattr(self.model, key) == value)
        result = await db.execute(query)
        return list(result.scalars().all())
