from contextlib import asynccontextmanager

from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.Auth.api.v1.api import api_router
from app.Auth.config import settings
from app.Auth.core.logger import setup_app_logging
from app.Auth.middleware.cors import setup_cors
from app.Auth.core.redis import redis_manager
from app.Auth.core.sentry import init_sentry
from app.Auth.core.rate_limit import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    setup_app_logging()
    init_sentry()
    # Init Redis connection pool
    redis_manager.init_pool(settings.REDIS_URL)
    yield
    # Shutdown actions
    await redis_manager.close()


def create_app() -> FastAPI:
    """
    FastAPI application factory.
    Assembles the application with routers, middlewares, and exception handlers.
    """
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        lifespan=lifespan,
    )

    # Setup Rate Limiting State & Handlers
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # Setup Middlewares
    setup_cors(app)
    from app.Auth.middleware.security import SecurityHeadersMiddleware
    app.add_middleware(SecurityHeadersMiddleware)

    # Expose Prometheus Metrics
    Instrumentator().instrument(app).expose(app)

    # Include Routers
    app.include_router(api_router, prefix=settings.API_V1_STR)

    return app


app = create_app()
