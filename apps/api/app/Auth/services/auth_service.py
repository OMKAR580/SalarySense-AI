from app.Auth.services.user_service import UserService
from app.Auth.services.token_service import TokenService
from app.Auth.services.session_service import SessionService
from app.Auth.schemas.auth import LoginRequest, RegisterRequest

class AuthService:
    """
    Purpose: Orchestrate login and registration flows.
    Dependencies: UserService, TokenService, SessionService, PasswordService
    Future phase: Phase 3.2B
    Expected implementation: login, register, logout
    """
    def __init__(
        self,
        user_service: UserService,
        token_service: TokenService,
        session_service: SessionService
    ):
        self.user_service = user_service
        self.token_service = token_service
        self.session_service = session_service
        
    async def login(self, request: LoginRequest):
        raise NotImplementedError("Future phase")
        
    async def register(self, request: RegisterRequest):
        raise NotImplementedError("Future phase")
