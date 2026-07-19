from pydantic import BaseModel, Field

class BatchRowSchema(BaseModel):
    age: float = Field(..., ge=0, lt=100, description="Age must be >= 0 and < 100")
    gender: str = Field(..., min_length=1, description="Gender is required and must be a string")
    education_level: str = Field(..., min_length=1, description="Education level is required and must be a string")
    job_title: str = Field(..., min_length=1, description="Job title is required and must be a string")
    years_of_experience: float = Field(..., ge=0, le=60, description="Years of experience must be >= 0 and <= 60")
