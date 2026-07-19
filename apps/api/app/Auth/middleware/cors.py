from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.Auth.config import settings


def setup_cors(app: FastAPI) -> None:
    """
    Sets up CORS (Cross-Origin Resource Sharing) middleware for the application.
    """
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
