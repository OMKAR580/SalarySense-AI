import math
from app.Auth.security.models import PasswordStrength
from app.Auth.security.constants import (
    ENTROPY_VERY_WEAK, ENTROPY_WEAK, ENTROPY_MEDIUM, ENTROPY_STRONG, STRENGTH_LABELS
)

def calculate_entropy(password: str) -> float:
    """
    Purpose: Calculate password entropy in bits.
    Arguments: password (str)
    Returns: float
    """
    if not password:
        return 0.0
    
    pool_size = 0
    if any(c.islower() for c in password): pool_size += 26
    if any(c.isupper() for c in password): pool_size += 26
    if any(c.isdigit() for c in password): pool_size += 10
    if any(not c.isalnum() for c in password): pool_size += 32
    
    if pool_size == 0:
        return 0.0
        
    return len(password) * math.log2(pool_size)

def analyze_password_strength(password: str) -> PasswordStrength:
    """
    Purpose: Analyze password strength and return structured result.
    Arguments: password (str)
    Returns: PasswordStrength
    """
    entropy = calculate_entropy(password)
    
    score = 0
    crack_time = "Instant"
    if entropy < ENTROPY_VERY_WEAK:
        score = 0
        crack_time = "Instantly crackable"
    elif entropy < ENTROPY_WEAK:
        score = 1
        crack_time = "Crackable in minutes"
    elif entropy < ENTROPY_MEDIUM:
        score = 2
        crack_time = "Crackable in days"
    elif entropy < ENTROPY_STRONG:
        score = 3
        crack_time = "Crackable in centuries"
    else:
        score = 4
        crack_time = "Practically uncrackable"
        
    recommendations = []
    if score < 3:
        if len(password) < 12:
            recommendations.append("Use at least 12 characters.")
        if not any(not c.isalnum() for c in password):
            recommendations.append("Add special characters or symbols.")
            
    return PasswordStrength(
        score=score,
        label=STRENGTH_LABELS.get(score, "Unknown"),
        entropy=round(entropy, 2),
        crack_time_category=crack_time,
        recommendations=recommendations
    )
