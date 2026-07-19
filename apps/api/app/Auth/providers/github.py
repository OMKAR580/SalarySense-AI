"""
GitHub OAuth provider interface.
TODO: Implement GitHub OAuth flow and user profile extraction.
"""

def get_github_auth_url() -> str:
    pass

def exchange_github_code(code: str) -> dict:
    pass
