from pydantic import BaseModel
from typing import List

class ExtractedFeatures(BaseModel):
    name: str
    job_title: str
    experience: float
    education_level: str
    skills: List[str]

class PredictionDetails(BaseModel):
    salary: float
    currency: str

class ResumePredictionResponse(BaseModel):
    success: bool
    extracted_features: ExtractedFeatures
    prediction: PredictionDetails
