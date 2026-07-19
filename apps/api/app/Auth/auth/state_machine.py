from enum import Enum
from app.Auth.auth.exceptions import StateTransitionError

class AuthState(Enum):
    PENDING = "pending"
    VALIDATING = "validating"
    RESOLVED = "resolved"
    CHALLENGED = "challenged"
    AUTHENTICATED = "authenticated"
    REJECTED = "rejected"
    FAILED = "failed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"

class AuthenticationStateMachine:
    """
    Purpose: Validates state transitions during the authentication flow.
    """
    def __init__(self):
        self.state = AuthState.PENDING
        self._valid_transitions = {
            AuthState.PENDING: [AuthState.VALIDATING, AuthState.CANCELLED],
            AuthState.VALIDATING: [AuthState.RESOLVED, AuthState.FAILED, AuthState.REJECTED],
            AuthState.RESOLVED: [AuthState.CHALLENGED, AuthState.AUTHENTICATED],
            AuthState.CHALLENGED: [AuthState.AUTHENTICATED, AuthState.FAILED, AuthState.EXPIRED],
            AuthState.AUTHENTICATED: [],
            AuthState.REJECTED: [],
            AuthState.FAILED: [],
            AuthState.EXPIRED: [],
            AuthState.CANCELLED: []
        }

    def transition(self, next_state: AuthState) -> None:
        if next_state not in self._valid_transitions[self.state]:
            raise StateTransitionError(f"Cannot transition from {self.state} to {next_state}")
        self.state = next_state
