from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

@dataclass
class PasswordValidationResult:
    is_valid: bool
    errors: List[str] = field(default_factory=list)

@dataclass
class PasswordStrength:
    score: int  # 0 to 4 (0=Very Weak, 4=Very Strong)
    label: str
    entropy: float
    crack_time_category: str
    recommendations: List[str] = field(default_factory=list)

@dataclass
class TokenMetadata:
    token: str
    expires_at: Optional[datetime] = None
    token_type: str = "generic"
    
@dataclass
class SecurityConfiguration:
    argon2_memory_cost: int
    argon2_time_cost: int
    argon2_parallelism: int
    password_min_length: int
    password_max_length: int
    token_length: int
    otp_length: int
    hash_algorithm: str
    allow_bcrypt_fallback: bool
