import re
from typing import List
from app.Auth.config.settings import settings
from app.Auth.security.models import PasswordValidationResult

# Compile regexes once for performance
UPPERCASE_RE = re.compile(r'[A-Z]')
LOWERCASE_RE = re.compile(r'[a-z]')
NUMBER_RE = re.compile(r'\d')
SPECIAL_RE = re.compile(r'[^a-zA-Z0-9]')
REPEATED_CHARS_RE = re.compile(r'(.){2,}')  # 3 or more repeated chars

def validate_password_policy(password: str, username: str = "", email: str = "") -> PasswordValidationResult:
    """
    Purpose: Validate password against enterprise policies.
    Arguments: password (str), username (str), email (str)
    Returns: PasswordValidationResult
    Raises: None
    Security Notes: Checks min/max length, character types, repetitions, similarity.
    """
    errors: List[str] = []
    
    if len(password) < settings.PASSWORD_MIN_LENGTH:
        errors.append(f"Password must be at least {settings.PASSWORD_MIN_LENGTH} characters long.")
    if len(password) > settings.PASSWORD_MAX_LENGTH:
        errors.append(f"Password cannot exceed {settings.PASSWORD_MAX_LENGTH} characters.")
        
    if not UPPERCASE_RE.search(password):
        errors.append("Password must contain at least one uppercase letter.")
    if not LOWERCASE_RE.search(password):
        errors.append("Password must contain at least one lowercase letter.")
    if not NUMBER_RE.search(password):
        errors.append("Password must contain at least one number.")
    if not SPECIAL_RE.search(password):
        errors.append("Password must contain at least one special character.")
        
    if REPEATED_CHARS_RE.search(password):
        errors.append("Password must not contain 3 or more repeated characters.")
        
    # Similarity checks
    if username and username.lower() in password.lower():
        errors.append("Password must not contain your username.")
    
    if email:
        email_prefix = email.split('@')[0]
        if email_prefix.lower() in password.lower():
            errors.append("Password must not contain your email address.")

    return PasswordValidationResult(is_valid=len(errors) == 0, errors=errors)


class PasswordPolicy:
    def validate(self, password: str, username: str = "", email: str = "") -> PasswordValidationResult:
        return validate_password_policy(password, username, email)

