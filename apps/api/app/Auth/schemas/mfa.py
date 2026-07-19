from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class MFASetupResponse(BaseModel):
    secret: str
    provisioning_uri: str

class MFAVerifyRequest(BaseModel):
    challenge_id: str
    code: str
    remember_device: bool = False
    device_name: Optional[str] = None
    device_identifier: Optional[str] = None

class MFAEnableRequest(BaseModel):
    method_type: str = "totp"
    code: str

class MFADisableRequest(BaseModel):
    code: str

class MFAChallengeRequest(BaseModel):
    challenge_id: str

class TrustedDeviceResponse(BaseModel):
    id: UUID
    device_identifier: str
    device_type: Optional[str]
    os: Optional[str]
    browser: Optional[str]
    trusted_until: datetime

class BackupCodesResponse(BaseModel):
    backup_codes: List[str]
