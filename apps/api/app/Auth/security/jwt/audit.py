from typing import Protocol

class JWTAuditContract(Protocol):
    async def record_token_created(self, jti: str, token_type: str, subject: str) -> None:
        ...
        
    async def record_token_validation(self, jti: str, token_type: str, subject: str) -> None:
        ...
        
    async def record_invalid_token(self, reason: str, token_snippet: str) -> None:
        ...
