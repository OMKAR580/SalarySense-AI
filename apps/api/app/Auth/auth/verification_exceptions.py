class VerificationException(Exception):
    pass

class InvalidVerificationToken(VerificationException):
    pass

class ExpiredVerificationToken(VerificationException):
    pass

class AlreadyVerified(VerificationException):
    pass

class VerificationLimitExceeded(VerificationException):
    pass
