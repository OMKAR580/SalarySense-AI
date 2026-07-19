import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "SalarySense Prediction API"
    API_V1_STR: str = "/api"
    
    # ML model configurations
    # Default path relative to this file: apps/api/app/core/ -> 4 levels up to workspace root
    MODEL_DIR: str = os.getenv(
        "MODEL_DIR",
        os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                "..",
                "..",
                "..",
                "..",
                "Salary-Prediction-ML",
                "datasets",
                "final"
            )
        )
    )
    
    # CORS origins configuration
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # API configuration
    API_BASE_URL: str = os.getenv("API_BASE_URL", "http://localhost:8000/api/v1")
    
    # OAuth Credentials
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    HUGGINGFACE_API_KEY: str = ""
    HUGGINGFACE_REPO_ID: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}

settings = Settings()
