from pydantic_settings import BaseSettings

class AuthenticationPipelineConfiguration(BaseSettings):
    enable_risk_evaluation: bool = True
    enable_adaptive_policies: bool = False
    fail_closed_on_error: bool = True

class StrategyConfiguration(BaseSettings):
    allowed_strategies: list[str] = ["password"]

class ProviderConfiguration(BaseSettings):
    default_provider: str = "password"

class PolicyConfiguration(BaseSettings):
    enforce_country_restrictions: bool = False

class ChallengeConfiguration(BaseSettings):
    mfa_grace_period_days: int = 7

class RiskConfiguration(BaseSettings):
    high_risk_threshold: int = 80
    impossible_travel_check: bool = True

class OrchestrationConfig:
    pipeline = AuthenticationPipelineConfiguration()
    strategy = StrategyConfiguration()
    provider = ProviderConfiguration()
    policy = PolicyConfiguration()
    challenge = ChallengeConfiguration()
    risk = RiskConfiguration()

orchestration_config = OrchestrationConfig()
