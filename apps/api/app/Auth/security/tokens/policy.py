from dataclasses import dataclass

@dataclass
class TokenPolicy:
    expiration_minutes: int
    sliding_expiration: bool = False
    max_lifetime_minutes: Optional[int] = None
    require_mfa: bool = False
    is_one_time: bool = False
    enforce_device_binding: bool = False

class SecurityPoliciesInterface:
    def check_replay(self, jti: str) -> bool: raise NotImplementedError
    def check_blacklist(self, jti: str) -> bool: raise NotImplementedError
    def check_whitelist(self, jti: str) -> bool: raise NotImplementedError
    def check_concurrent_sessions(self, user_id: str) -> bool: raise NotImplementedError
    def check_device_limits(self, user_id: str) -> bool: raise NotImplementedError
    def calculate_risk_score(self, context: dict) -> int: raise NotImplementedError
