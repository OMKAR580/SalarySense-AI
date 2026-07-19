class OAuthService:
    """
    Purpose: Manage OAuth social logins.
    Dependencies: OAuthRepository, UserService
    Future phase: Phase 3.5
    Expected implementation: get_auth_url, handle_callback, link_account
    """
    def __init__(self, oauth_repository, user_service):
        self.oauth_repository = oauth_repository
        self.user_service = user_service
        
    async def get_auth_url(self, provider: str):
        raise NotImplementedError("Future phase")
