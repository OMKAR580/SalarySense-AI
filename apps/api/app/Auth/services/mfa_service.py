import hashlib
import secrets
import pyotp
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any, Dict
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.Auth.models.two_factor_method import TwoFactorMethod
from app.Auth.models.backup_code import BackupCode
from app.Auth.models.trusted_device import TrustedDevice
from app.Auth.models.device import Device
from app.Auth.models.system_setting import SystemSetting
from app.Auth.repositories.two_factor import two_factor_repository
from app.Auth.repositories.backup_code import backup_code_repository
from app.Auth.repositories.trusted_device import trusted_device_repository
from app.Auth.repositories.device import device_repository
from app.Auth.repositories.system_setting import system_setting_repository
from app.Auth.repositories.user import user_repository
from app.Auth.repositories.session import session_repository
from app.Auth.repositories.refresh_token import refresh_token_repository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.services.email_service import EmailService
from app.Auth.services.events import (
    MFAEnabled, MFADisabled, MFAVerified, 
    ChallengeCreated, ChallengeCompleted, 
    BackupCodesGenerated, TrustedDeviceAdded, TrustedDeviceRemoved
)

def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

class MfaService:
    def __init__(
        self,
        db: AsyncSession,
        jwt_manager: JWTManager,
        email_service: EmailService,
        two_factor_repo=two_factor_repository,
        backup_code_repo=backup_code_repository,
        trusted_device_repo=trusted_device_repository,
        device_repo=device_repository,
        system_setting_repo=system_setting_repository,
        user_repo=user_repository,
        session_repo=session_repository,
        refresh_token_repo=refresh_token_repository,
        event_dispatcher: Optional[Any] = None,
        audit: Optional[Any] = None
    ):
        self.db = db
        self.jwt_manager = jwt_manager
        self.email_service = email_service
        self.two_factor_repo = two_factor_repo
        self.backup_code_repo = backup_code_repo
        self.trusted_device_repo = trusted_device_repo
        self.device_repo = device_repo
        self.system_setting_repo = system_setting_repo
        self.user_repo = user_repo
        self.session_repo = session_repo
        self.refresh_token_repo = refresh_token_repo
        self.event_dispatcher = event_dispatcher
        self.audit = audit

    async def setup_totp(self, user_id: UUID) -> Dict[str, str]:
        user = await self.user_repo.get_by_id(self.db, user_id)
        if not user:
            raise ValueError("User not found.")

        # Check if already has verified TOTP
        existing = await self.two_factor_repo.get_by_user_and_type(self.db, user_id, "totp")
        if existing and existing.is_verified:
            raise ValueError("TOTP is already enabled.")

        secret = pyotp.random_base32()
        totp = pyotp.totp.TOTP(secret)
        provisioning_uri = totp.provisioning_uri(name=user.email, issuer_name="RajAuth")

        if existing:
            existing.secret = secret
            self.db.add(existing)
        else:
            new_method = TwoFactorMethod(
                user_id=user_id,
                method_type="totp",
                secret=secret,
                is_primary=True,
                is_verified=False
            )
            self.db.add(new_method)
        
        await self.db.flush()
        return {"secret": secret, "provisioning_uri": provisioning_uri}

    async def enable_totp(self, user_id: UUID, code: str) -> Dict[str, Any]:
        method = await self.two_factor_repo.get_by_user_and_type(self.db, user_id, "totp")
        if not method:
            raise ValueError("TOTP setup not initiated.")
        
        totp = pyotp.totp.TOTP(method.secret)
        if not totp.verify(code):
            raise ValueError("Invalid verification code.")

        method.is_verified = True
        method.is_primary = True
        self.db.add(method)
        await self.db.flush()

        # Generate backup codes automatically on MFA enable
        backup_codes = await self.regenerate_backup_codes(user_id)

        # Audit & Event
        if self.audit:
            await self.audit.record_security_event("MFA_ENABLED", user_id, "TOTP enabled")
        if self.event_dispatcher:
            await self.event_dispatcher.dispatch(MFAEnabled(user_id=user_id, method_type="totp", timestamp=datetime.now(timezone.utc)))

        return {"status": "success", "backup_codes": backup_codes}

    async def disable_mfa(self, user_id: UUID, code: str) -> Dict[str, str]:
        methods = await self.two_factor_repo.get_verified_by_user(self.db, user_id)
        if not methods:
            raise ValueError("MFA is not enabled.")

        # Verify using primary method (if TOTP, verify TOTP or backup code)
        totp_method = next((m for m in methods if m.method_type == "totp"), None)
        verified = False
        
        if totp_method:
            totp = pyotp.totp.TOTP(totp_method.secret)
            if totp.verify(code):
                verified = True

        if not verified:
            # Try to verify via backup code
            hashed = sha256_hash(code)
            active_codes = await self.backup_code_repo.get_active_codes(self.db, user_id)
            matched = next((bc for bc in active_codes if bc.code_hash == hashed), None)
            if matched:
                matched.is_used = True
                self.db.add(matched)
                verified = True
                if self.audit:
                    await self.audit.record_security_event("BACKUP_CODE_USED", user_id, "Backup code used to disable MFA")

        if not verified:
            raise ValueError("Invalid verification code.")

        # Delete all TwoFactor methods and backup codes
        for m in methods:
            await self.two_factor_repo.delete(self.db, id=m.id)
        await self.backup_code_repo.delete_by_user(self.db, user_id)
        await self.db.flush()

        # Audit & Event
        if self.audit:
            await self.audit.record_security_event("MFA_DISABLED", user_id, "MFA disabled")
        if self.event_dispatcher:
            await self.event_dispatcher.dispatch(MFADisabled(user_id=user_id, timestamp=datetime.now(timezone.utc)))

        return {"status": "success"}

    async def regenerate_backup_codes(self, user_id: UUID) -> List[str]:
        # Delete existing backup codes
        await self.backup_code_repo.delete_by_user(self.db, user_id)

        plain_codes = []
        for _ in range(10):
            # Generate 10-char hex secure code
            code = secrets.token_hex(5)
            plain_codes.append(code)
            
            hashed = sha256_hash(code)
            bc = BackupCode(
                user_id=user_id,
                code_hash=hashed,
                is_used=False
            )
            self.db.add(bc)

        await self.db.flush()

        if self.audit:
            await self.audit.record_security_event("BACKUP_CODES_REGENERATED", user_id, "Backup codes regenerated")
        if self.event_dispatcher:
            await self.event_dispatcher.dispatch(BackupCodesGenerated(user_id=user_id, timestamp=datetime.now(timezone.utc)))

        return plain_codes

    async def list_trusted_devices(self, user_id: UUID) -> List[Dict[str, Any]]:
        trusted_records = await self.trusted_device_repo.get_by_user(self.db, user_id)
        res = []
        now = datetime.now(timezone.utc)
        for tr in trusted_records:
            # Check expiration
            expires_at = tr.trusted_until
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            
            if expires_at > now:
                # Resolve device metadata
                device = await self.device_repo.get_by_id(self.db, tr.device_id)
                if device:
                    res.append({
                        "id": tr.id,
                        "device_identifier": device.device_identifier,
                        "device_type": device.device_type,
                        "os": device.os,
                        "browser": device.browser,
                        "trusted_until": tr.trusted_until
                    })
        return res

    async def remove_trusted_device(self, user_id: UUID, trusted_device_id: UUID) -> None:
        tr = await self.trusted_device_repo.get_by_id(self.db, trusted_device_id)
        if tr:
            if tr.user_id != user_id:
                raise ValueError("Unauthorized to remove this device.")
            await self.trusted_device_repo.delete(self.db, id=trusted_device_id)
            await self.db.flush()

            if self.audit:
                await self.audit.record_security_event("TRUSTED_DEVICE_REMOVED", user_id, f"Trusted device removed: {trusted_device_id}")
            if self.event_dispatcher:
                await self.event_dispatcher.dispatch(TrustedDeviceRemoved(user_id=user_id, device_id=tr.device_id, timestamp=datetime.now(timezone.utc)))

    async def trigger_email_otp_challenge(self, challenge_id: str) -> None:
        validation = self.jwt_manager.validate_token(challenge_id)
        if not validation.is_valid or getattr(validation.claims, "typ", None) != "mfa_challenge":
            raise ValueError("Invalid or expired challenge.")

        user_id = UUID(validation.claims.sub)
        user = await self.user_repo.get_by_id(self.db, user_id)
        if not user:
            raise ValueError("User not found.")

        challenge_jti = validation.claims.jti
        otp = "".join(secrets.choice("0123456789") for _ in range(6))
        
        # Save state to SystemSetting to avoid schema modifications
        otp_key = f"email_otp:{challenge_jti}"
        state = {
            "hash": sha256_hash(otp),
            "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=5)).isoformat(),
            "attempts": 0
        }
        
        existing = await self.system_setting_repo.get_by_key(self.db, otp_key)
        if existing:
            existing.value = state
            self.db.add(existing)
        else:
            setting = SystemSetting(
                key=otp_key,
                value=state,
                description=f"Email OTP state for challenge {challenge_jti}",
                is_active=True
            )
            self.db.add(setting)

        await self.db.flush()
        await self.email_service.send_mfa_otp(user.email, otp)

    async def verify_challenge(
        self,
        challenge_id: str,
        code: str,
        remember_device: bool = False,
        device_name: Optional[str] = None,
        device_identifier: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> Dict[str, Any]:
        validation = self.jwt_manager.validate_token(challenge_id)
        if not validation.is_valid or getattr(validation.claims, "typ", None) != "mfa_challenge":
            if self.audit:
                await self.audit.record_security_event("MFA_FAILURE", None, "Invalid mfa challenge signature or expiry")
            raise ValueError("Invalid or expired challenge.")

        claims = validation.claims
        user_id = UUID(claims.sub)
        challenge_jti = claims.jti
        method_type = claims.metadata.get("method")

        # 1. Replay protection
        completed_key = f"mfa_challenge_completed:{challenge_jti}"
        completed = await self.system_setting_repo.get_by_key(self.db, completed_key)
        if completed:
            if self.audit:
                await self.audit.record_security_event("MFA_FAILURE", user_id, f"MFA challenge replay attempt: {challenge_jti}")
            raise ValueError("Challenge has already been completed.")

        user = await self.user_repo.get_by_id(self.db, user_id)
        if not user:
            raise ValueError("User not found.")

        verified = False
        backup_used = False

        # Try verifying as backup code first, or if TOTP/Email verification fails
        hashed_code = sha256_hash(code)
        active_codes = await self.backup_code_repo.get_active_codes(self.db, user_id)
        matched_backup = next((bc for bc in active_codes if bc.code_hash == hashed_code), None)
        
        if matched_backup:
            matched_backup.is_used = True
            self.db.add(matched_backup)
            verified = True
            backup_used = True
            if self.audit:
                await self.audit.record_security_event("BACKUP_CODE_USED", user_id, "Backup code used for verification")
        
        if not verified:
            if method_type == "totp":
                totp_record = await self.two_factor_repo.get_by_user_and_type(self.db, user_id, "totp")
                if not totp_record or not totp_record.is_verified:
                    raise ValueError("TOTP is not enabled.")
                totp = pyotp.totp.TOTP(totp_record.secret)
                if totp.verify(code):
                    verified = True
            elif method_type == "email":
                otp_key = f"email_otp:{challenge_jti}"
                setting = await self.system_setting_repo.get_by_key(self.db, otp_key)
                if not setting:
                    raise ValueError("OTP challenge not initialized.")
                
                state = setting.value
                expires_at = datetime.fromisoformat(state["expires_at"])
                if expires_at.tzinfo is None:
                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                
                if datetime.now(timezone.utc) > expires_at:
                    raise ValueError("OTP has expired.")

                if state["attempts"] >= 3:
                    raise ValueError("Maximum OTP attempts exceeded.")

                # Increment and save attempts
                state["attempts"] += 1
                setting.value = state
                self.db.add(setting)
                await self.db.flush()

                # Secure compare
                if secrets.compare_digest(sha256_hash(code), state["hash"]):
                    verified = True
                    # Cleanup OTP key
                    await self.system_setting_repo.delete(self.db, id=setting.id)
            else:
                raise ValueError("Unsupported challenge method.")

        if not verified:
            if self.audit:
                await self.audit.record_security_event("MFA_FAILURE", user_id, "Invalid challenge code")
            raise ValueError("Invalid verification code.")

        # Mark challenge as completed to prevent replay
        comp_setting = SystemSetting(
            key=completed_key,
            value=True,
            description=f"Challenge {challenge_jti} completed successfully",
            is_active=True
        )
        self.db.add(comp_setting)

        # Handle trusted device
        device_trusted = False
        if remember_device and device_identifier:
            device = await self.device_repo.get_by_user_and_identifier(self.db, user_id, device_identifier)
            if not device:
                device = await self.device_repo.create(self.db, obj_in={
                    "user_id": user_id,
                    "device_identifier": device_identifier,
                    "device_type": device_name or "Unknown Device",
                    "last_ip": ip_address,
                    "last_active": datetime.now(timezone.utc)
                })
            
            # Add TrustedDevice record
            trusted_record = TrustedDevice(
                device_id=device.id,
                user_id=user_id,
                trusted_until=datetime.now(timezone.utc) + timedelta(days=30)
            )
            self.db.add(trusted_record)
            await self.db.flush()
            device_trusted = True

            if self.audit:
                await self.audit.record_security_event("TRUSTED_DEVICE_ADDED", user_id, f"Device trusted: {device_identifier}")
            if self.event_dispatcher:
                await self.event_dispatcher.dispatch(TrustedDeviceAdded(user_id=user_id, device_id=device.id, timestamp=datetime.now(timezone.utc)))

        # Create Session Response via standardized repository method
        device_id = None
        if remember_device and device_identifier:
            dev = await self.device_repo.get_by_user_and_identifier(self.db, user_id, device_identifier)
            if dev:
                device_id = dev.id

        session_id = uuid4()
        await self.session_repo.create_session_record(
            db=self.db,
            user_id=user_id,
            session_id=session_id,
            device_id=device_id,
            duration_minutes=1440 # 24 hours
        )

        # Issue custom JWT tokens with MFA claims
        custom_claims = {
            "email": user.email,
            "username": user.username,
            "roles": [r.name for r in getattr(user, "roles", [])],
            "permissions": [p.name for p in getattr(user, "permissions", [])],
            "session_id": str(session_id),
            "mfa_verified": True,
            "authentication_method": "backup_code" if backup_used else method_type,
            "authentication_level": 2,
            "trusted_device": device_trusted
        }

        token_pair = self.jwt_manager.create_token_pair(str(user_id), custom_claims)

        # Audit & Events
        if self.audit:
            await self.audit.record_security_event("MFA_SUCCESS", user_id, f"MFA challenge completed via {method_type}")
        if self.event_dispatcher:
            await self.event_dispatcher.dispatch(MFAVerified(user_id=user_id, method_type=method_type, timestamp=datetime.now(timezone.utc)))
            await self.event_dispatcher.dispatch(ChallengeCompleted(user_id=user_id, challenge_id=UUID(challenge_jti), timestamp=datetime.now(timezone.utc)))

        return {
            "access_token": token_pair.access_token.token,
            "refresh_token": token_pair.refresh_token.token,
            "expires_in": token_pair.access_token.expires_in,
            "user_id": user_id,
            "session_id": session_id
        }
