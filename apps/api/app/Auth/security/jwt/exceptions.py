class JWTException(Exception):
    pass

class InvalidJWT(JWTException):
    pass

class ExpiredJWT(JWTException):
    pass

class MalformedJWT(JWTException):
    pass

class InvalidSignature(JWTException):
    pass

class InvalidIssuer(JWTException):
    pass

class InvalidAudience(JWTException):
    pass

class InvalidClaims(JWTException):
    pass

class UnsupportedAlgorithm(JWTException):
    pass

class TokenCreationFailed(JWTException):
    pass

class TokenValidationFailed(JWTException):
    pass
