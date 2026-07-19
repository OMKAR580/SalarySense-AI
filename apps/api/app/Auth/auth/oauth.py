"""
OAuth orchestration interface.
TODO: Implement common OAuth flow controllers.
"""

def get_authorization_url(provider_name: str) -> str:
    """Get the URL to redirect the user to for OAuth consent."""
    pass

def process_oauth_callback(provider_name: str, code: str) -> dict:
    """Process the callback code and exchange it for user info."""
    pass
