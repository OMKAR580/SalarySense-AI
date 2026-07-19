from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID
from datetime import datetime

class OAuthLinkRequest(BaseModel):
    provider: str
    provider_user_id: str
    email: EmailStr

class OAuthAccountResponse(BaseModel):
    id: UUID
    provider: str
    provider_account_id: str
    created_at: datetime
