from dataclasses import dataclass
from typing import Dict, Any, Optional
from datetime import datetime

@dataclass
class AuthenticationStarted:
    correlation_id: str
    provider: str
    timestamp: datetime

@dataclass
class AuthenticationValidated:
    correlation_id: str
    timestamp: datetime

@dataclass
class AuthenticationSucceeded:
    correlation_id: str
    user_id: str
    timestamp: datetime

@dataclass
class AuthenticationFailed:
    correlation_id: str
    reason: str
    timestamp: datetime

@dataclass
class AuthenticationCancelled:
    correlation_id: str
    timestamp: datetime

@dataclass
class AuthenticationChallenged:
    correlation_id: str
    challenge_type: str
    timestamp: datetime

@dataclass
class ProviderResolved:
    correlation_id: str
    provider: str
    timestamp: datetime

@dataclass
class RiskEvaluated:
    correlation_id: str
    score: int
    timestamp: datetime

@dataclass
class PolicyEvaluated:
    correlation_id: str
    policy_name: str
    passed: bool
    timestamp: datetime
