import asyncio
import logging
from fastapi import status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)

# 10 MB payload size limit
MAX_PAYLOAD_SIZE = 10 * 1024 * 1024

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        # 1. Enforce payload size limit
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_PAYLOAD_SIZE:
                    return Response(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        content="Payload Too Large"
                    )
            except ValueError:
                pass

        # 2. Enforce request timeout (30 seconds)
        try:
            response = await asyncio.wait_for(call_next(request), timeout=30.0)
        except asyncio.TimeoutError:
            logger.error(f"Request timeout exceeded for path: {request.url.path}")
            return Response(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                content="Request Timeout"
            )

        # 3. Apply standard security headers
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
        
        return response
