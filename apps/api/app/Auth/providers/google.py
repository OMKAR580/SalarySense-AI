"""
Google OAuth provider interface.
TODO: Implement Google OAuth flow and user profile extraction.
"""

def get_google_auth_url() -> str:
    pass

def exchange_google_code(code: str) -> dict:
    pass
