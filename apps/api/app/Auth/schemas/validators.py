from typing import Any
import re
from pydantic import BaseModel, EmailStr, Field, field_validator

class EmailValidator(BaseModel):
    email: EmailStr

class PasswordValidator(BaseModel):
    password: str = Field(..., min_length=8, max_length=128)
    
class UsernameValidator(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)

class PhoneValidator(BaseModel):
    phone: str
    
    @field_validator('phone')
    def validate_phone(cls, v: str) -> str:
        if not re.match(r'^\+?1?\d{9,15}$', v):
            raise ValueError("Invalid phone number format")
        return v

class OTPValidator(BaseModel):
    otp: str = Field(..., min_length=6, max_length=6)

class TokenValidator(BaseModel):
    token: str = Field(..., min_length=32)

class DeviceValidator(BaseModel):
    device_id: str
    device_name: str
