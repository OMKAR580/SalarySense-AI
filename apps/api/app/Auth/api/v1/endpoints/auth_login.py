from fastapi import APIRouter, Depends, HTTPException, status
from app.Auth.schemas.login import LoginRequest, LoginResponse, RefreshRequest, LogoutRequest
from app.Auth.services.login_service import LoginService
from app.Auth.api.deps.login_deps import get_login_service
from app.Auth.auth.login.exceptions import (
    InvalidCredentials, AccountLocked, EmailNotVerified, 
    RefreshExpired, ConcurrentLimitReached
)

router = APIRouter()

from fastapi import Request
from app.Auth.core.rate_limit import limiter

from app.Auth.core.rate_limit import check_login_rate_limit

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    request: LoginRequest,
    login_service: LoginService = Depends(get_login_service),
    _rate_limit = Depends(check_login_rate_limit)
):
    try:
        response = await login_service.login(request)
        return response
    except InvalidCredentials as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    except AccountLocked as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except EmailNotVerified as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/refresh", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def refresh(
    request: RefreshRequest,
    login_service: LoginService = Depends(get_login_service)
):
    try:
        response = await login_service.refresh(request)
        return response
    except RefreshExpired as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
        
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: LogoutRequest,
    login_service: LoginService = Depends(get_login_service)
):
    await login_service.logout(request)
    return None
