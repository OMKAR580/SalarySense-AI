from abc import ABC, abstractmethod
from typing import List, Any
from app.Auth.auth.context import AuthenticationContext
from app.Auth.auth.result import AuthenticationResult
from app.Auth.auth.strategy import AuthenticationStrategy

class PipelineStage(ABC):
    @abstractmethod
    def execute(self, context: AuthenticationContext, state: dict) -> None:
        pass

class RequestValidationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class CredentialValidationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class UserResolutionStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class AccountValidationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class EmailVerificationCheckStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class PolicyEvaluationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class RiskEvaluationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class ChallengeDecisionStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class SessionPreparationStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class TokenGenerationHookStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class AuditHookStage(PipelineStage):
    def execute(self, context: AuthenticationContext, state: dict) -> None: pass

class AuthenticationPipeline:
    """
    Purpose: Orchestrates the execution of modular validation stages.
    """
    def __init__(self):
        self.stages: List[PipelineStage] = [
            RequestValidationStage(),
            CredentialValidationStage(),
            UserResolutionStage(),
            AccountValidationStage(),
            EmailVerificationCheckStage(),
            PolicyEvaluationStage(),
            RiskEvaluationStage(),
            ChallengeDecisionStage(),
            SessionPreparationStage(),
            TokenGenerationHookStage(),
            AuditHookStage()
        ]

    def process(self, context: AuthenticationContext, strategy: AuthenticationStrategy, credentials: Any) -> AuthenticationResult:
        state = {"strategy": strategy, "credentials": credentials}
        
        for stage in self.stages:
            stage.execute(context, state)
            
        # Strategy final execution
        return strategy.authenticate(context, credentials)
