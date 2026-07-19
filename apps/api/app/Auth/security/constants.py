# Security Constants

# Password Limits
PASSWORD_MIN_LENGTH_DEFAULT = 8
PASSWORD_MAX_LENGTH_DEFAULT = 128

# Token Lengths
TOKEN_LENGTH_DEFAULT = 32
OTP_LENGTH_DEFAULT = 6

# Hash Algorithms
HASH_ALGO_ARGON2 = "argon2"
HASH_ALGO_BCRYPT = "bcrypt"

# Entropy Thresholds (Bits)
ENTROPY_VERY_WEAK = 25
ENTROPY_WEAK = 35
ENTROPY_MEDIUM = 50
ENTROPY_STRONG = 70

# Strength Labels
STRENGTH_LABELS = {
    0: "Very Weak",
    1: "Weak",
    2: "Medium",
    3: "Strong",
    4: "Very Strong"
}

# Cookie Defaults
COOKIE_SECURE_DEFAULT = True
COOKIE_HTTPONLY_DEFAULT = True
COOKIE_SAMESITE_DEFAULT = "lax"

# Security Headers
SECURITY_HEADERS = {
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "default-src 'self'"
}
