class RecoveryException(Exception):
    pass

class EmailAlreadyVerified(RecoveryException):
    pass

class InvalidVerificationToken(RecoveryException):
    pass

class VerificationExpired(RecoveryException):
    pass

class PasswordReuseDetected(RecoveryException):
    pass

class PasswordHistoryViolation(RecoveryException):
    pass

class PasswordExpired(RecoveryException):
    pass

class ResetTokenExpired(RecoveryException):
    pass

class ResetTokenInvalid(RecoveryException):
    pass
