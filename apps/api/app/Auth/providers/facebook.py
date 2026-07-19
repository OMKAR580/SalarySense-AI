"""
Facebook OAuth provider interface.
TODO: Implement Facebook OAuth flow and user profile extraction.
"""

def get_facebook_auth_url() -> str:
    pass

def exchange_facebook_code(code: str) -> dict:
    pass
