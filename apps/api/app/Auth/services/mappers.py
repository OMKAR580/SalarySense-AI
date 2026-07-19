from app.Auth.schemas.domain import AuthenticatedUser
from app.Auth.schemas.user import UserResponse
from app.Auth.models.user import User

class UserMapper:
    @staticmethod
    def to_domain(user: User) -> AuthenticatedUser:
        return AuthenticatedUser(
            id=user.id,
            email=user.email,
            roles=[r.name for r in user.roles] if hasattr(user, 'roles') else [],
            permissions=[]
        )

    @staticmethod
    def to_dto(user: User) -> UserResponse:
        return UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            is_active=user.is_active,
            is_verified=user.is_verified
        )
