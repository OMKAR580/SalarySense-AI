class AuthenticationOrchestrationError(Exception):
    """Base exception for authentication orchestration errors."""
    pass

class AuthenticationPipelineError(AuthenticationOrchestrationError):
    pass

class AuthenticationStrategyError(AuthenticationOrchestrationError):
    pass

class ProviderResolutionError(AuthenticationOrchestrationError):
    pass

class ChallengeRequired(AuthenticationOrchestrationError):
    pass

class PolicyViolation(AuthenticationOrchestrationError):
    pass

class RiskEvaluationError(AuthenticationOrchestrationError):
    pass

class StateTransitionError(AuthenticationOrchestrationError):
    pass

class ContextCreationError(AuthenticationOrchestrationError):
    pass
