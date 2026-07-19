from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from app.Auth.schemas.registration import RegisterRequest, RegisterResponse
from app.Auth.services.registration_service import RegistrationService
from app.Auth.api.deps.registration_deps import get_registration_service
from app.Auth.auth.registration.exceptions import (
    DuplicateEmail, DuplicateUsername, PasswordTooWeak, 
    TermsNotAccepted, RegistrationFailed
)

router = APIRouter()

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    registration_service: RegistrationService = Depends(get_registration_service)
):
    try:
        response = await registration_service.register(request)
        return response
    except (DuplicateEmail, DuplicateUsername) as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except (PasswordTooWeak, TermsNotAccepted) as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))
    except RegistrationFailed as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


from app.Auth.schemas.registration import VerifyEmailRequest, ResendVerificationRequest
from app.Auth.api.deps.verification_deps import get_verify_email_service, get_resend_verification_service
from app.Auth.services.verify_email_service import VerifyEmailService
from app.Auth.services.resend_verification_service import ResendVerificationService
from app.Auth.auth.verification_exceptions import (
    InvalidVerificationToken, ExpiredVerificationToken, AlreadyVerified, VerificationLimitExceeded
)

@router.post("/verify-email", status_code=status.HTTP_200_OK)
async def verify_email(
    request: VerifyEmailRequest,
    verify_service: VerifyEmailService = Depends(get_verify_email_service)
):
    try:
        response = await verify_service.verify_email(request.token)
        return response
    except (InvalidVerificationToken, ExpiredVerificationToken) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except AlreadyVerified as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/resend-verification", status_code=status.HTTP_200_OK)
async def resend_verification(
    request: ResendVerificationRequest,
    resend_service: ResendVerificationService = Depends(get_resend_verification_service)
):
    try:
        response = await resend_service.resend_verification(request.email)
        return response
    except AlreadyVerified as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except VerificationLimitExceeded as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


from app.Auth.schemas.recovery import ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
from app.Auth.api.deps.recovery_deps import (
    get_forgot_password_service, get_reset_password_service, get_password_service, get_current_user
)
from app.Auth.services.forgot_password_service import ForgotPasswordService
from app.Auth.services.reset_password_service import ResetPasswordService
from app.Auth.services.password_service import PasswordService
from app.Auth.auth.recovery_exceptions import (
    ResetTokenInvalid, ResetTokenExpired, PasswordHistoryViolation, PasswordReuseDetected
)
from app.Auth.models.user import User

from app.Auth.core.rate_limit import check_forgot_password_rate_limit

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: ForgotPasswordRequest,
    forgot_service: ForgotPasswordService = Depends(get_forgot_password_service),
    _rate_limit = Depends(check_forgot_password_rate_limit)
):
    try:
        return await forgot_service.request_reset(request.email)
    except ValueError as e:
        # Resolve identity status rejections with HTTP 400 Bad Request
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ResetPasswordRequest,
    reset_service: ResetPasswordService = Depends(get_reset_password_service)
):
    try:
        return await reset_service.reset_password(request.token, request.new_password)
    except (ResetTokenInvalid, ResetTokenExpired, PasswordHistoryViolation, PasswordReuseDetected) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/change-password", status_code=status.HTTP_200_OK)
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    password_service: PasswordService = Depends(get_password_service)
):
    try:
        return await password_service.change_password(
            user_id=current_user.id,
            current_password=request.current_password,
            new_password=request.new_password
        )
    except (PasswordHistoryViolation, PasswordReuseDetected) as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


from typing import List
from uuid import UUID
from app.Auth.schemas.mfa import (
    MFASetupResponse, MFAVerifyRequest, MFAEnableRequest, 
    MFADisableRequest, MFAChallengeRequest, TrustedDeviceResponse, BackupCodesResponse
)
from app.Auth.api.deps.mfa_deps import get_mfa_service
from app.Auth.services.mfa_service import MfaService
from fastapi import Request

@router.post("/mfa/setup", response_model=MFASetupResponse, status_code=status.HTTP_200_OK)
async def setup_mfa(
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        return await mfa_service.setup_totp(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/enable", status_code=status.HTTP_200_OK)
async def enable_mfa(
    request: MFAEnableRequest,
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        return await mfa_service.enable_totp(current_user.id, request.code)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/disable", status_code=status.HTTP_200_OK)
async def disable_mfa(
    request: MFADisableRequest,
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        return await mfa_service.disable_mfa(current_user.id, request.code)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/verify", status_code=status.HTTP_200_OK)
async def verify_mfa(
    request: MFAVerifyRequest,
    req_obj: Request,
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        ip = req_obj.client.host if req_obj.client else None
        return await mfa_service.verify_challenge(
            challenge_id=request.challenge_id,
            code=request.code,
            remember_device=request.remember_device,
            device_name=request.device_name,
            device_identifier=request.device_identifier,
            ip_address=ip
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/challenge", status_code=status.HTTP_200_OK)
async def trigger_challenge(
    request: MFAChallengeRequest,
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        await mfa_service.trigger_email_otp_challenge(request.challenge_id)
        return {"status": "success", "message": "Email OTP challenge triggered."}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/mfa/devices", response_model=List[TrustedDeviceResponse], status_code=status.HTTP_200_OK)
async def list_devices(
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        return await mfa_service.list_trusted_devices(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/mfa/devices/{id}", status_code=status.HTTP_200_OK)
async def delete_device(
    id: UUID,
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        await mfa_service.remove_trusted_device(current_user.id, id)
        return {"status": "success"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/backup-codes", response_model=BackupCodesResponse, status_code=status.HTTP_200_OK)
async def get_backup_codes(
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        codes = await mfa_service.regenerate_backup_codes(current_user.id)
        return {"backup_codes": codes}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/mfa/regenerate-backup-codes", response_model=BackupCodesResponse, status_code=status.HTTP_200_OK)
async def regenerate_backup_codes(
    current_user: User = Depends(get_current_user),
    mfa_service: MfaService = Depends(get_mfa_service)
):
    try:
        codes = await mfa_service.regenerate_backup_codes(current_user.id)
        return {"backup_codes": codes}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


from typing import Optional, List
from app.Auth.schemas.oauth import OAuthLinkRequest, OAuthAccountResponse
from app.Auth.api.deps.oauth_deps import get_oauth_service
from app.Auth.auth.oauth.oauth_service import OAuthService

@router.get("/oauth/{provider}/login", status_code=status.HTTP_200_OK)
async def oauth_login(
    provider: str,
    current_user_id: Optional[UUID] = None,
    oauth_service: OAuthService = Depends(get_oauth_service)
):
    try:
        res = await oauth_service.get_login_url(provider, current_user_id)
        return RedirectResponse(url=res["authorization_url"])
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/oauth/{provider}/callback", status_code=status.HTTP_200_OK)
async def oauth_callback(
    provider: str,
    code: str,
    state: str,
    oauth_service: OAuthService = Depends(get_oauth_service)
):
    try:
        result = await oauth_service.handle_callback(provider, code, state)
        from app.core.config import settings
        import urllib.parse
        
        if result.get("oauth_register"):
            encoded_email = urllib.parse.quote(result["email"])
            redirect_url = f"{settings.FRONTEND_URL}/login?oauth_register=true&email={encoded_email}&provider={result['provider']}&provider_account_id={result['provider_account_id']}"
            return RedirectResponse(url=redirect_url)
            
        if result.get("mfa_required"):
            return RedirectResponse(
                url=f"{settings.FRONTEND_URL}/login?mfa_required=true&challenge_id={result['challenge_id']}&provider={provider}"
            )
            
        access_token = result.get("access_token")
        refresh_token = result.get("refresh_token") or ""
        user_id = str(result.get("user_id", ""))
        email = result.get("email", "")
        username = result.get("username", "")
        
        encoded_email = urllib.parse.quote(email) if email else ""
        encoded_username = urllib.parse.quote(username) if username else ""
        
        redirect_url = f"{settings.FRONTEND_URL}/login?access_token={access_token}&refresh_token={refresh_token}&user_id={user_id}&email={encoded_email}&username={encoded_username}"
        return RedirectResponse(url=redirect_url)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/oauth/link", status_code=status.HTTP_200_OK)
async def link_oauth(
    request: OAuthLinkRequest,
    current_user: User = Depends(get_current_user),
    oauth_service: OAuthService = Depends(get_oauth_service)
):
    try:
        await oauth_service.link_provider_manually(
            user_id=current_user.id,
            provider_name=request.provider,
            provider_user_id=request.provider_user_id,
            email=request.email
        )
        return {"status": "success", "message": f"{request.provider} linked successfully."}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/oauth/{provider}/unlink", status_code=status.HTTP_200_OK)
async def unlink_oauth(
    provider: str,
    current_user: User = Depends(get_current_user),
    oauth_service: OAuthService = Depends(get_oauth_service)
):
    try:
        await oauth_service.unlink_provider(current_user.id, provider)
        return {"status": "success", "message": f"{provider} unlinked successfully."}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/oauth/accounts", response_model=List[OAuthAccountResponse], status_code=status.HTTP_200_OK)
async def list_oauth_accounts(
    current_user: User = Depends(get_current_user),
    oauth_service: OAuthService = Depends(get_oauth_service)
):
    try:
        return await oauth_service.get_linked_accounts(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


from app.Auth.api.deps.rbac_deps import get_rbac_service
from app.Auth.services.rbac_service import RbacService

@router.get("/me/permissions", response_model=List[str], status_code=status.HTTP_200_OK)
async def get_my_permissions(
    current_user: User = Depends(get_current_user),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        return await rbac_service.get_user_permissions(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/me/roles", status_code=status.HTTP_200_OK)
async def get_my_roles(
    current_user: User = Depends(get_current_user),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        roles = await rbac_service.get_user_roles(current_user.id)
        return [{"id": r.id, "name": r.name, "description": r.description} for r in roles]
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


from app.Auth.schemas.login import CurrentUserResponse

@router.get("/me", response_model=CurrentUserResponse, status_code=status.HTTP_200_OK)
async def get_me(
    current_user: User = Depends(get_current_user),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        roles = await rbac_service.get_user_roles(current_user.id)
        permissions = await rbac_service.get_user_permissions(current_user.id)
        return CurrentUserResponse(
            id=current_user.id,
            email=current_user.email,
            username=current_user.username,
            avatar=getattr(current_user, 'avatar', None),
            roles=[r.name for r in roles],
            permissions=permissions
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))



