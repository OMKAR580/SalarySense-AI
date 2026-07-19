from passlib.context import CryptContext
from app.Auth.config.settings import settings

# Initialize passlib context
# We use passlib for easy fallback management and scheme configuration
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],
    default="argon2" if settings.HASH_ALGORITHM == "argon2" else "bcrypt",
    argon2__memory_cost=settings.ARGON2_MEMORY_COST,
    argon2__time_cost=settings.ARGON2_TIME_COST,
    argon2__parallelism=settings.ARGON2_PARALLELISM,
    deprecated="auto"
)

def hash_password(password: str) -> str:
    """
    Purpose: Hash a plaintext password.
    Arguments: password (str)
    Returns: str (hashed password)
    Raises: ValueError if password is empty
    Security Notes: Uses enterprise grade hashing (Argon2id preferred).
    """
    if not password:
        raise ValueError("Password cannot be empty")
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Purpose: Verify a plaintext password against a hash.
    Arguments: plain_password (str), hashed_password (str)
    Returns: bool
    Security Notes: Mitigates timing attacks implicitly via passlib.
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False

def needs_rehash(hashed_password: str) -> bool:
    """
    Purpose: Check if a password hash needs to be updated.
    Arguments: hashed_password (str)
    Returns: bool
    Security Notes: Checks if hash matches current default algorithm and costs.
    """
    try:
        return pwd_context.needs_update(hashed_password)
    except Exception:
        return True


class PasswordHasher:
    def hash_password(self, password: str) -> str:
        return hash_password(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return verify_password(plain_password, hashed_password)

    def needs_rehash(self, hashed_password: str) -> bool:
        return needs_rehash(hashed_password)

