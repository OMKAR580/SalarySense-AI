"""
Session management interface.
TODO: Implement server-side session handling (e.g., Redis-backed sessions).
"""

def create_session(user_id: str) -> str:
    """Create a new session and return the session ID."""
    pass

def get_session(session_id: str) -> dict:
    """Retrieve session data."""
    pass
