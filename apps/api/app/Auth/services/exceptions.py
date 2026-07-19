class AuthenticationFailed(Exception):
    pass

class InvalidCredentials(Exception):
    pass

class AccountLocked(Exception):
    pass

class AccountDisabled(Exception):
    pass

class EmailNotVerified(Exception):
    pass

class PasswordExpired(Exception):
    pass

class SessionExpired(Exception):
    pass

class TooManyAttempts(Exception):
    pass

class OAuthProviderError(Exception):
    pass

class ServiceUnavailable(Exception):
    pass
