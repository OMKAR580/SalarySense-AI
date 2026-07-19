import hmac
import hashlib
import secrets

def constant_time_compare(val1: str, val2: str) -> bool:
    """
    Purpose: Compare two strings in constant time.
    Arguments: val1 (str), val2 (str)
    Returns: bool
    Security Notes: Mitigates timing attacks.
    """
    return secrets.compare_digest(val1.encode('utf-8'), val2.encode('utf-8'))

def sha256(data: str) -> str:
    """
    Purpose: Generate SHA-256 hash of a string.
    Arguments: data (str)
    Returns: str (hex digest)
    """
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def sha512(data: str) -> str:
    """
    Purpose: Generate SHA-512 hash of a string.
    Arguments: data (str)
    Returns: str (hex digest)
    """
    return hashlib.sha512(data.encode('utf-8')).hexdigest()

def hmac_sha256(key: str, message: str) -> str:
    """
    Purpose: Generate HMAC-SHA256 of a message.
    Arguments: key (str), message (str)
    Returns: str (hex digest)
    """
    return hmac.new(key.encode('utf-8'), message.encode('utf-8'), hashlib.sha256).hexdigest()

def hash_file(file_path: str, chunk_size: int = 8192) -> str:
    """
    Purpose: Securely hash a file using SHA-256.
    Arguments: file_path (str), chunk_size (int)
    Returns: str
    """
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(chunk_size), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def fingerprint(data: str) -> str:
    """
    Purpose: Generate a quick short fingerprint (SHA256 truncated).
    Arguments: data (str)
    Returns: str
    """
    return sha256(data)[:16]
