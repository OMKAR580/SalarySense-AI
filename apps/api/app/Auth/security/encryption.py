from typing import Optional
from cryptography.fernet import Fernet
from app.Auth.core.exceptions import EncryptionFailure

class EncryptionHelper:
    """
    Purpose: Provide symmetric encryption utilities.
    Security Notes: Uses Fernet (AES-128-CBC with HMAC).
    """
    
    def __init__(self, primary_key: str, fallback_keys: Optional[list] = None):
        try:
            self.primary_fernet = Fernet(primary_key.encode('utf-8'))
            self.fallback_fernets = [Fernet(k.encode('utf-8')) for k in (fallback_keys or [])]
        except Exception as e:
            raise EncryptionFailure(f"Failed to initialize encryption: {e}")

    @staticmethod
    def generate_key() -> str:
        """
        Purpose: Generate a new Fernet key.
        Returns: str
        """
        return Fernet.generate_key().decode('utf-8')

    def encrypt(self, plaintext: str) -> str:
        """
        Purpose: Encrypt data.
        Arguments: plaintext (str)
        Returns: str
        Raises: EncryptionFailure
        """
        try:
            return self.primary_fernet.encrypt(plaintext.encode('utf-8')).decode('utf-8')
        except Exception as e:
            raise EncryptionFailure(f"Encryption failed: {e}")

    def decrypt(self, ciphertext: str) -> str:
        """
        Purpose: Decrypt data, trying primary then fallbacks (Key Rotation).
        Arguments: ciphertext (str)
        Returns: str
        Raises: EncryptionFailure
        """
        raw_cipher = ciphertext.encode('utf-8')
        try:
            return self.primary_fernet.decrypt(raw_cipher).decode('utf-8')
        except Exception:
            for f in self.fallback_fernets:
                try:
                    return f.decrypt(raw_cipher).decode('utf-8')
                except Exception:
                    pass
            raise EncryptionFailure("Decryption failed with all available keys.")
