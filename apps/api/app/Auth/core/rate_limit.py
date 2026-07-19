import os
import logging
from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

logger = logging.getLogger(__name__)

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Initialize slowapi Limiter
try:
    if os.getenv("TESTING") == "True":
        limiter = Limiter(key_func=get_remote_address, storage_uri="memory://", enabled=False)
    else:
        limiter = Limiter(key_func=get_remote_address, storage_uri=redis_url)
    logger.info("SlowAPI rate limiter initialized.")
except Exception as e:
    logger.warning(f"Failed to initialize Redis rate limit storage (falling back to memory): {e}")
    limiter = Limiter(key_func=get_remote_address, storage_uri="memory://")

def get_user_identifier(request: Request) -> str:
    """
    Get unique identifier for rate limiting (Authenticated User ID or Remote IP).
    """
    user = getattr(request.state, "user", None)
    if user:
        return f"user:{user.id}"
    return get_remote_address(request)

async def get_email_identifier(request: Request) -> str:
    """
    Get unique identifier for rate limiting based on email payload.
    """
    try:
        # We clone or read body safely without consuming it irreversibly if needed,
        # but in slowapi/FastAPI, request.json() cache is saved in request._json.
        body = await request.json()
        email = body.get("email")
        if email:
            return f"email:{email}"
    except Exception:
        pass
    return get_remote_address(request)

import time
from fastapi import HTTPException, status
from app.Auth.models.user import User

async def enforce_admin_rate_limit(request: Request, user: User):
    """
    Enforce 100 requests/minute per authenticated user.
    """
    if os.getenv("TESTING") == "True":
        return
    now = int(time.time())
    minute_bucket = now // 60
    key = f"rate_limit:admin:{user.id}:{minute_bucket}"
    
    from app.Auth.services.cache_service import cache_service
    count = await cache_service.get(key) or 0
    if count >= 100:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 100 requests per minute."
        )
    await cache_service.set(key, count + 1, ttl=60)

from app.Auth.schemas.recovery import ForgotPasswordRequest

async def check_login_rate_limit(request: Request):
    """
    Enforce 5 login requests/minute per IP address.
    """
    if os.getenv("TESTING") == "True":
        return
    ip = get_remote_address(request)
    key = f"rate_limit:login:{ip}"
    
    from app.Auth.services.cache_service import cache_service
    count = await cache_service.get(key) or 0
    if count >= 5:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 5 login requests per minute."
        )
    await cache_service.set(key, count + 1, ttl=60)

async def check_forgot_password_rate_limit(request: Request, forgot_req: ForgotPasswordRequest):
    """
    Enforce 3 forgot password requests/hour per email.
    """
    if os.getenv("TESTING") == "True":
        return
    email = forgot_req.email
    key = f"rate_limit:forgot_password:{email}"
    
    from app.Auth.services.cache_service import cache_service
    count = await cache_service.get(key) or 0
    if count >= 3:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 3 password reset requests per hour."
        )
    await cache_service.set(key, count + 1, ttl=3600)
