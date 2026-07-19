from pydantic import BaseModel, EmailStr, Field

class ForgotPasswordRequest(BaseModel):
    email: EmailStr = Field(..., description="The user's registered email address")

class ResetPasswordRequest(BaseModel):
    token: str = Field(..., description="The short-lived password reset JWT")
    new_password: str = Field(..., min_length=8, description="The new password")

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., description="The user's current password")
    new_password: str = Field(..., min_length=8, description="The new password to set")
