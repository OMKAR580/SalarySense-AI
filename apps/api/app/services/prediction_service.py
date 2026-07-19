import time
import os
import requests
import logging
import pandas as pd
from app.ml.loader import MLLoader
from app.core.config import settings

logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        self.ml_loader = MLLoader()

    def predict(
        self,
        age: float,
        gender: str,
        education_level: str,
        job_title: str,
        years_of_experience: float
    ) -> dict:
        start_time = time.perf_counter()
        
        # 1. Attempt Hugging Face Serverless Endpoint Inference first if configured
        hf_token = settings.HUGGINGFACE_API_KEY
        repo_id = settings.HUGGINGFACE_REPO_ID or "omkardubey165/salarysense-ridge-model"
        
        if hf_token:
            try:
                # Query Hugging Face serverless Inference API
                api_url = f"https://api-inference.huggingface.co/models/{repo_id}"
                headers = {"Authorization": f"Bearer {hf_token}"}
                payload = {
                    "inputs": {
                        "Age": age,
                        "Gender": gender,
                        "Education Level": education_level,
                        "Job Title": job_title,
                        "Years of Experience": years_of_experience
                    }
                }
                
                response = requests.post(api_url, headers=headers, json=payload, timeout=3)
                if response.status_code == 200:
                    res_data = response.json()
                    # Scikit-learn outputs are typically returned as lists or dicts
                    predicted_val = res_data[0] if isinstance(res_data, list) else res_data
                    if isinstance(predicted_val, dict):
                        predicted_val = predicted_val.get("score") or predicted_val.get("label") or predicted_val
                    
                    rounded_salary = round(float(predicted_val), 2)
                    duration_ms = (time.perf_counter() - start_time) * 1000
                    logger.info(f"Hugging Face prediction success: {rounded_salary} USD (Time: {duration_ms:.2f} ms)")
                    
                    return {
                        "salary": rounded_salary,
                        "currency": "USD",
                        "model": f"Hugging Face: {repo_id}"
                    }
                else:
                    logger.warning(f"Hugging Face Inference Endpoint returned status {response.status_code}. Falling back to local model.")
            except Exception as e:
                logger.warning(f"Hugging Face inference request failed: {str(e)}. Falling back to local model.")

        # 2. Local Fallback Execution
        if not self.ml_loader._initialized:
            raise RuntimeError("ML model and preprocessor are not initialized.")
            
        logger.info(
            f"Prediction request (Local Fallback): Age={age}, Gender={gender}, "
            f"Education={education_level}, Job={job_title}, Experience={years_of_experience}"
        )
        
        try:
            # Map request fields to exact feature names expected by the model
            mapping = {
                "Age": age,
                "Gender": gender,
                "Education Level": education_level,
                "Job Title": job_title,
                "Years of Experience": years_of_experience
            }
            
            # Reorder columns dynamically based on feature_columns.json
            ordered_data = {col: mapping[col] for col in self.ml_loader.feature_columns}
            df = pd.DataFrame([ordered_data])
            
            # Execute preprocessing transform
            transformed_features = self.ml_loader.preprocessor.transform(df)
            
            # Extract regressor if the model is loaded as a pipeline
            if hasattr(self.ml_loader.model, "steps"):
                regressor = self.ml_loader.model.steps[-1][1]
            else:
                regressor = self.ml_loader.model
                
            # Perform prediction
            prediction = regressor.predict(transformed_features)
            raw_salary = float(prediction[0])
            
            # Round prediction output to 2 decimal places
            rounded_salary = round(raw_salary, 2)
            
            duration_ms = (time.perf_counter() - start_time) * 1000
            logger.info(f"Prediction success (Local): {rounded_salary} USD (Time: {duration_ms:.2f} ms)")
            
            return {
                "salary": rounded_salary,
                "currency": "USD",
                "model": self.ml_loader.metadata.get("model", "Ridge Regression")
            }
        except Exception as e:
            logger.error(f"Prediction failure: {str(e)}")
            raise e
