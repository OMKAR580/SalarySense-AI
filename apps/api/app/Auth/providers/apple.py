"""
Apple OAuth provider interface.
TODO: Implement Apple OAuth flow and user profile extraction.
"""

def get_apple_auth_url() -> str:
    pass

def exchange_apple_code(code: str) -> dict:
    pass
