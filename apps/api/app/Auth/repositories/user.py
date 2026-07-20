from datetime import datetime, timezone
from typing import Any, List, Optional, Union
from uuid import UUID

from sqlalchemy import select, or_, and_, update, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.Auth.models.user import User
from app.Auth.repositories.base import BaseRepository


class UserRepository(BaseRepository[User, Any, Any]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        """
        Purpose: Retrieve a user by email.
        Arguments:
            db: AsyncSession
            email: str
        Return Type: Optional[User]
        Raises: None
        """
        from app.Auth.models.role import Role
        query = select(self.model).filter(func.lower(self.model.email) == func.lower(email)).options(
            selectinload(self.model.roles).selectinload(Role.permissions)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_username(self, db: AsyncSession, username: str) -> Optional[User]:
        """
        Purpose: Retrieve a user by username.
        Arguments:
            db: AsyncSession
            username: str
        Return Type: Optional[User]
        Raises: None
        """
        from app.Auth.models.role import Role
        query = select(self.model).filter(func.lower(self.model.username) == func.lower(username)).options(
            selectinload(self.model.roles).selectinload(Role.permissions)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_phone(self, db: AsyncSession, phone: str) -> Optional[User]:
        """
        Purpose: Retrieve a user by phone.
        Arguments:
            db: AsyncSession
            phone: str
        Return Type: Optional[User]
        Raises: None
        """
        query = select(self.model).filter(self.model.phone == phone)
        result = await db.execute(query)
        return result.scalars().first()

    async def get_by_uuid(self, db: AsyncSession, uuid_val: Union[str, UUID]) -> Optional[User]:
        """
        Purpose: Retrieve a user by UUID.
        Arguments:
            db: AsyncSession
            uuid_val: str or UUID
        Return Type: Optional[User]
        Raises: None
        """
        from app.Auth.models.role import Role
        query = select(self.model).filter(self.model.id == uuid_val).options(
            selectinload(self.model.roles).selectinload(Role.permissions)
        )
        result = await db.execute(query)
        return result.scalars().first()

    async def email_exists(self, db: AsyncSession, email: str) -> bool:
        """
        Purpose: Check if an email is already registered.
        Arguments:
            db: AsyncSession
            email: str
        Return Type: bool
        Raises: None
        """
        query = select(self.model.id).filter(func.lower(self.model.email) == func.lower(email))
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def username_exists(self, db: AsyncSession, username: str) -> bool:
        """
        Purpose: Check if a username is already registered.
        Arguments:
            db: AsyncSession
            username: str
        Return Type: bool
        Raises: None
        """
        query = select(self.model.id).filter(func.lower(self.model.username) == func.lower(username))
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def phone_exists(self, db: AsyncSession, phone: str) -> bool:
        """
        Purpose: Check if a phone is already registered.
        Arguments:
            db: AsyncSession
            phone: str
        Return Type: bool
        Raises: None
        """
        query = select(self.model.id).filter(self.model.phone == phone)
        result = await db.execute(query)
        return result.scalars().first() is not None

    async def search_users(self, db: AsyncSession, *, query_str: str, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Purpose: Search users by email, username, or phone.
        Arguments:
            db: AsyncSession
            query_str: str - Search query
            skip: int
            limit: int
        Return Type: List[User]
        Raises: None
        """
        like_query = f"%{query_str}%"
        query = (
            select(self.model)
            .filter(
                or_(
                    self.model.email.ilike(like_query),
                    self.model.username.ilike(like_query),
                    self.model.phone.ilike(like_query)
                )
            )
            .offset(skip)
            .limit(limit)
        )
        result = await db.execute(query)
        return list(result.scalars().all())

    async def list_active_users(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Purpose: Get a paginated list of active users.
        Arguments:
            db: AsyncSession
            skip: int
            limit: int
        Return Type: List[User]
        Raises: None
        """
        query = select(self.model).filter(self.model.is_active == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def list_verified_users(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Purpose: Get a paginated list of verified users.
        Arguments:
            db: AsyncSession
            skip: int
            limit: int
        Return Type: List[User]
        Raises: None
        """
        query = select(self.model).filter(self.model.is_verified == True).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def list_locked_users(self, db: AsyncSession, *, skip: int = 0, limit: int = 100) -> List[User]:
        """
        Purpose: Get a paginated list of locked/inactive users.
        Arguments:
            db: AsyncSession
            skip: int
            limit: int
        Return Type: List[User]
        Raises: None
        """
        query = select(self.model).filter(self.model.is_active == False).offset(skip).limit(limit)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def update_last_login(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Update the last_login timestamp for a user.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.last_login = datetime.utcnow()
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def update_password_hash(self, db: AsyncSession, user: User, password_hash: str) -> User:
        """
        Purpose: Update the password hash for a user.
        Arguments:
            db: AsyncSession
            user: User
            password_hash: str
        Return Type: User
        Raises: None
        """
        user.password_hash = password_hash
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def verify_email(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Mark user email as verified.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.is_verified = True
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def activate_user(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Activate a user account.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.is_active = True
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def deactivate_user(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Deactivate a user account.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.is_active = False
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def soft_delete(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Soft delete a user by setting deleted_at.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.deleted_at = datetime.utcnow()
        user.is_active = False
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def restore(self, db: AsyncSession, user: User) -> User:
        """
        Purpose: Restore a soft-deleted user.
        Arguments:
            db: AsyncSession
            user: User
        Return Type: User
        Raises: None
        """
        user.deleted_at = None
        user.is_active = True
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

user_repository = UserRepository()
