class LoginException(Exception): pass
class InvalidCredentials(LoginException): pass
class AccountLocked(LoginException): pass
class EmailNotVerified(LoginException): pass
class SessionExpired(LoginException): pass
class RefreshExpired(LoginException): pass
class ConcurrentLimitReached(LoginException): pass
