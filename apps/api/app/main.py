import logging
import sys
import types
from contextlib import asynccontextmanager

# 1. Register dummy 'backend' module and 'backend.app' alias pointing to 'app.Auth'
if "backend" not in sys.modules:
    backend_module = types.ModuleType("backend")
    sys.modules["backend"] = backend_module

import app.Auth as auth_module
sys.modules["backend.app"] = auth_module

from fastapi import FastAPI, Request, status, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.core.logging import setup_logging
from app.ml.loader import MLLoader
from app.api.predict import router as predict_router
from app.api.predict_resume import router as predict_resume_router
from app.api.batch_predict import router as batch_predict_router
from app.Auth.api.v1.api import api_router as auth_router

# Configure centralized logging
setup_logging()
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML assets ONCE at startup
    logger.info("Starting up: Loading ML model assets...")
    try:
        loader = MLLoader()
        loader.initialize(settings.MODEL_DIR)
        logger.info("Lifespan startup complete: Model successfully loaded.")
    except Exception as e:
        logger.critical(f"Failed to load ML model assets on startup: {str(e)}")
        # Allow startup to continue but log critical issue

    # Initialize Auth Database and Redis with self-healing local SQLite/Memory fallbacks
    try:
        from app.Auth.database.base import Base
        from app.Auth.database.session import engine
        from app.Auth.core.redis import redis_manager
        from app.Auth.config import settings as auth_settings
        
        # Test if Postgres is running; if not, re-create engine with SQLite fallback
        try:
            logger.info("Testing PostgreSQL connection for Auth...")
            async with engine.connect() as conn:
                pass
            logger.info("PostgreSQL connection verified successfully.")
        except Exception:
            logger.warning("PostgreSQL not active. Falling back to local SQLite database: auth_dev.db")
            import os
            from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
            import app.Auth.database.session as session_mod
            
            sqlite_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "auth_dev.db"))
            sqlite_url = f"sqlite+aiosqlite:///{sqlite_path}"
            
            auth_settings.SQLALCHEMY_DATABASE_URI = sqlite_url
            session_mod.engine = create_async_engine(
                sqlite_url,
                pool_pre_ping=True,
                echo=False
            )
            session_mod.AsyncSessionLocal = async_sessionmaker(
                bind=session_mod.engine,
                class_=AsyncSession,
                expire_on_commit=False,
                autoflush=False
            )
            logger.info("SQLite engine fallback initialized.")
            
        # Re-check database session engine
        from app.Auth.database.session import engine as active_engine
        logger.info("Creating database tables for Auth (if not exist)...")
        async with active_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables verified.")
        
        # Initialize Redis
        try:
            logger.info("Initializing Redis pool for Auth...")
            redis_manager.init_pool(auth_settings.REDIS_URL)
        except Exception:
            logger.warning("Redis server not active. Using in-memory fallback cache.")
            redis_manager.client = None
            
    except Exception as e:
        logger.error(f"Failed to initialize Auth backend resource configurations: {str(e)}")

    print("\n===== OAUTH CONFIG =====")
    print("Config Module: app.core.config")
    print(f"API_BASE_URL: {settings.API_BASE_URL}")
    print(f"Google Callback: {settings.API_BASE_URL}/auth/oauth/google/callback")
    print(f"Github Callback: {settings.API_BASE_URL}/auth/oauth/github/callback")
    print("========================\n")

    yield
    # Cleanup on shutdown (if any)
    logger.info("Shutting down: Releasing resources...")
    try:
        from app.Auth.core.redis import redis_manager
        if redis_manager.client is not None:
            await redis_manager.close()
    except Exception:
        pass

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS Origins
origins = [
    settings.FRONTEND_URL,
    "http://localhost:3001",
    "http://127.0.0.1:3001"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(predict_router, prefix="/api")
app.include_router(predict_resume_router, prefix="/api")
app.include_router(batch_predict_router, prefix="/api")
app.include_router(auth_router, prefix="/api/v1")

# Mount static folder for avatars
static_dir = os.path.abspath(os.path.join(os.getcwd(), "static"))
os.makedirs(os.path.join(static_dir, "avatars"), exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Handle request validation errors globally (HTTP 422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors_summary = []
    for error in exc.errors():
        loc = " -> ".join(str(x) for x in error.get("loc", []))
        msg = error.get("msg", "Invalid value")
        errors_summary.append(f"[{loc}]: {msg}")
    
    validation_msg = "; ".join(errors_summary)
    logger.warning(f"Validation Failure: {validation_msg}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation Error",
            "message": "The request payload did not pass validation rules.",
            "details": errors_summary
        }
    )

# Handle standard HTTPErrors with standard schema mapping
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": "Request Error",
            "message": exc.detail
        }
    )

# Handle general unhandled internal exceptions (HTTP 500)
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Internal Error: {str(exc)}")
    # Never expose python stack traces, file paths, or internals in production responses
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing the prediction request."
        }
    )
