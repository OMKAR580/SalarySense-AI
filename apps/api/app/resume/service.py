import logging
from app.resume.parser import ResumeParser
from app.resume.extractor import ResumeExtractor
from app.services.prediction_service import PredictionService

logger = logging.getLogger(__name__)

class ResumeService:
    def __init__(self):
        self.prediction_service = PredictionService()

    def process_and_predict(self, file_bytes: bytes) -> dict:
        # 1. Parse PDF text
        text = ResumeParser.extract_text(file_bytes)
        
        # 2. Extract information
        extracted = ResumeExtractor.extract_info(text)
        
        # 3. Formulate existing ML features
        # Heuristic: Age = Experience + 23 (with minimum of 23.0)
        age = max(23.0, float(extracted["years_of_experience"]) + 23.0)
        gender = "Male"  # Default fallback
        
        # 4. Predict salary using the existing prediction service
        logger.info(
            f"Resume workflow triggering prediction service: "
            f"Job='{extracted['job_title']}', Exp={extracted['years_of_experience']}, Edu='{extracted['education_level']}'"
        )
        
        prediction = self.prediction_service.predict(
            age=age,
            gender=gender,
            education_level=extracted["education_level"],
            job_title=extracted["job_title"],
            years_of_experience=extracted["years_of_experience"]
        )
        
        # 5. Format response to match required schema
        return {
            "success": True,
            "extracted_features": {
                "name": extracted["name"],
                "job_title": extracted["job_title"],
                "experience": extracted["years_of_experience"],
                "education_level": extracted["education_level"],
                "skills": extracted["skills"]
            },
            "prediction": {
                "salary": prediction["salary"],
                "currency": prediction["currency"]
            }
        }
        
    def mock_empty_extraction(self) -> dict:
        # For testing error states or custom empty handling
        return {
            "name": "Applicant Name",
            "job_title": "Software Engineer",
            "years_of_experience": 0.0,
            "education_level": "Bachelor's",
            "skills": []
        }
