from uuid import UUID

class TokenService:
    """
    Purpose: Generate and validate JWTs and refresh tokens.
    Dependencies: RefreshTokenRepository
    Future phase: Phase 3.2B
    Expected implementation: generate_tokens, verify_access_token, rotate_refresh_token
    """
    def __init__(self, refresh_token_repository):
        self.refresh_token_repository = refresh_token_repository
        
    async def generate_tokens(self, user_id: UUID, session_id: UUID):
        raise NotImplementedError("Future phase")
