import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)
router = APIRouter()

# Input Validation Schema
class PredictionRequest(BaseModel):
    age: float = Field(..., ge=0, lt=100, description="Age must be >= 0 and < 100")
    gender: str = Field(..., min_length=1, description="Gender is required and must be a string")
    education_level: str = Field(..., min_length=1, description="Education level is required and must be a string")
    job_title: str = Field(..., min_length=1, description="Job title is required and must be a string")
    years_of_experience: float = Field(..., ge=0, le=60, description="Years of experience must be >= 0 and <= 60")

# Output Response Schema
class PredictionResponseDetails(BaseModel):
    salary: float
    currency: str
    model: str

class PredictionResponse(BaseModel):
    success: bool
    prediction: PredictionResponseDetails

def get_prediction_service() -> PredictionService:
    return PredictionService()

@router.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Salary Prediction"
)
async def predict_salary(
    payload: PredictionRequest,
    service: PredictionService = Depends(get_prediction_service)
):
    try:
        result = service.predict(
            age=payload.age,
            gender=payload.gender,
            education_level=payload.education_level,
            job_title=payload.job_title,
            years_of_experience=payload.years_of_experience
        )
        return PredictionResponse(success=True, prediction=result)
    except Exception as e:
        # Re-raise HTTP exceptions; other exceptions handled globally in main.py
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during prediction computation."
        )
