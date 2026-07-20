import os
import base64
import hashlib
import secrets
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, List
from uuid import UUID, uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.Auth.auth.oauth.google import GoogleOAuthProvider
from app.Auth.auth.oauth.github import GitHubOAuthProvider
from app.Auth.auth.oauth.microsoft import MicrosoftOAuthProvider
from app.Auth.auth.oauth.apple import AppleOAuthProvider
from app.Auth.auth.oauth.facebook import FacebookOAuthProvider
from app.Auth.models.oauth_account import OAuthAccount
from app.Auth.models.system_setting import SystemSetting
from app.Auth.models.user import User
from app.Auth.repositories.oauth import oauth_repository, oauth_provider_config_repository
from app.Auth.repositories.user import user_repository
from app.Auth.repositories.two_factor import two_factor_repository
from app.Auth.repositories.session import session_repository
from app.Auth.security.jwt.manager import JWTManager
from app.Auth.services.events import ChallengeCreated, OAuthLinked

def sha256_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

def generate_pkce_challenge(code_verifier: str) -> str:
    hashed = hashlib.sha256(code_verifier.encode("ascii")).digest()
    return base64.urlsafe_b64encode(hashed).decode("utf-8").replace("=", "")

class OAuthService:
    def __init__(
        self,
        db: AsyncSession,
        jwt_manager: JWTManager,
        oauth_repo=oauth_repository,
        provider_config_repo=oauth_provider_config_repository,
        user_repo=user_repository,
        two_factor_repo=two_factor_repository,
        session_repo=session_repository,
        event_dispatcher: Optional[Any] = None,
        audit: Optional[Any] = None
    ):
        self.db = db
        self.jwt_manager = jwt_manager
        self.oauth_repo = oauth_repo
        self.provider_config_repo = provider_config_repo
        self.user_repo = user_repo
        self.two_factor_repo = two_factor_repo
        self.session_repo = session_repo
        self.event_dispatcher = event_dispatcher
        self.audit = audit

    async def _get_provider_instance(self, provider_name: str) -> Any:
        # Load from DB config table first
        config = await self.provider_config_repo.get_by_name(self.db, provider_name)
        from app.core.config import settings
        
        env_client_id = getattr(settings, f"{provider_name.upper()}_CLIENT_ID", None)
        env_client_secret = getattr(settings, f"{provider_name.upper()}_CLIENT_SECRET", "dummy_secret")
        if not env_client_secret:
            env_client_secret = "dummy_secret"
            
        client_id = config.client_id if config and config.client_id else env_client_id
        client_secret = env_client_secret

        if not client_id:
            client_id = f"dummy_{provider_name}_client_id"

        if provider_name == "google":
            return GoogleOAuthProvider(client_id, client_secret)
        elif provider_name == "github":
            return GitHubOAuthProvider(client_id, client_secret)
        elif provider_name == "facebook":
            return FacebookOAuthProvider(client_id, client_secret)
        elif provider_name == "microsoft":
            return MicrosoftOAuthProvider(client_id, client_secret)
        elif provider_name == "apple":
            return AppleOAuthProvider(
                client_id=client_id,
                team_id=os.getenv("APPLE_TEAM_ID", "dummy_team"),
                key_id=os.getenv("APPLE_KEY_ID", "dummy_key"),
                private_key=os.getenv("APPLE_PRIVATE_KEY")
            )
        else:
            raise ValueError(f"Unsupported OAuth provider: {provider_name}")

    def _get_redirect_uri(self, provider_name: str) -> str:
        from app.core.config import settings
        return f"{settings.API_BASE_URL}/auth/oauth/{provider_name}/callback"

    async def get_login_url(self, provider_name: str, current_user_id: Optional[UUID] = None) -> Dict[str, str]:
        provider = await self._get_provider_instance(provider_name)
        redirect_uri = self._get_redirect_uri(provider_name)
        
        # State validation & PKCE
        state = secrets.token_urlsafe(16)
        code_verifier = secrets.token_urlsafe(32)
        code_challenge = generate_pkce_challenge(code_verifier)

        # Store state to SystemSetting with 10-minute expiry
        state_key = f"oauth_state:{state}"
        state_data = {
            "code_verifier": code_verifier,
            "user_id": str(current_user_id) if current_user_id else None,
            "expires_at": (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
        }

        try:
            # Clear expired state setting if key is somehow present
            query = select(SystemSetting).filter(SystemSetting.key == state_key)
            res = await self.db.execute(query)
            existing = res.scalars().first()
            if existing:
                existing.value = state_data
                self.db.add(existing)
            else:
                setting = SystemSetting(
                    key=state_key,
                    value=state_data,
                    description=f"OAuth state for provider {provider_name}",
                    is_active=True
                )
                self.db.add(setting)

            await self.db.flush()

            auth_url = provider.get_authorization_url(redirect_uri, state, code_challenge)
            await self.db.commit()
            return {"authorization_url": auth_url, "state": state}
        except Exception as e:
            await self.db.rollback()
            raise e

    async def handle_callback(
        self,
        provider_name: str,
        code: str,
        state: str
    ) -> Dict[str, Any]:
        redirect_uri = self._get_redirect_uri(provider_name)
        try:
            # 1. State parameter validation
            state_key = f"oauth_state:{state}"
            query = select(SystemSetting).filter(SystemSetting.key == state_key)
            res = await self.db.execute(query)
            setting = res.scalars().first()
            if not setting:
                raise ValueError("Invalid or expired OAuth state parameter.")

            state_data = setting.value
            expires_at = datetime.fromisoformat(state_data["expires_at"])
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            
            if datetime.now(timezone.utc) > expires_at:
                await self.db.delete(setting)
                await self.db.commit()
                raise ValueError("OAuth state parameter has expired.")

            code_verifier = state_data["code_verifier"]
            link_user_id = UUID(state_data["user_id"]) if state_data.get("user_id") else None

            # Clean state parameter (Replay attack prevention!)
            await self.db.delete(setting)
            await self.db.flush()

            # 2. Token exchange and profile fetch
            provider = await self._get_provider_instance(provider_name)
            tokens = await provider.exchange_code(code, redirect_uri, code_verifier)
            
            access_token_hash = sha256_hash(tokens.get("access_token", ""))

            user_info = await provider.get_user_info(tokens)
            provider_user_id = user_info.get("id")
            email = user_info.get("email")

            if not email or not provider_user_id:
                raise ValueError("Could not retrieve email or provider ID from OAuth profile.")

            # 3. Handle flows
            if link_user_id:
                # Explicit account linking request while authenticated
                existing_oauth = await self.oauth_repo.get_provider(self.db, provider_name, provider_user_id)
                if existing_oauth:
                    raise ValueError("This OAuth account is already linked to another user.")
                
                # Check if current user already linked this provider
                user_accounts = await self.oauth_repo.list_accounts(self.db, link_user_id)
                if any(a.provider == provider_name for a in user_accounts):
                    raise ValueError(f"You have already linked a {provider_name} account.")

                # Link account
                linked = await self.oauth_repo.link_account(self.db, {
                    "user_id": link_user_id,
                    "provider": provider_name,
                    "provider_account_id": provider_user_id,
                    "access_token": access_token_hash,
                    "refresh_token": tokens.get("refresh_token")
                })

                # Event & Audit
                if self.audit:
                    await self.audit.record_security_event("TRUSTED_DEVICE_ADDED", link_user_id, f"OAuth {provider_name} linked")
                if self.event_dispatcher:
                    await self.event_dispatcher.dispatch(OAuthLinked(user_id=link_user_id, provider=provider_name, timestamp=datetime.now(timezone.utc)))

                await self.db.commit()
                return {"status": "success", "message": f"{provider_name} account linked successfully."}

            else:
                # Login flow via callback
                oauth_acc = await self.oauth_repo.get_provider(self.db, provider_name, provider_user_id)
                
                if oauth_acc:
                    # Direct login
                    user = await self.user_repo.get_by_id(self.db, oauth_acc.user_id)
                    if user and not user.is_verified:
                        user.is_verified = True
                        self.db.add(user)
                else:
                    # Existing account check (No duplicate users constraint)
                    user = await self.user_repo.get_by_email(self.db, email)
                    
                    if user:
                        # Automatically link Google/GitHub/etc. identity to existing account
                        await self.oauth_repo.link_account(self.db, {
                            "user_id": user.id,
                            "provider": provider_name,
                            "provider_account_id": provider_user_id,
                            "access_token": access_token_hash,
                            "refresh_token": tokens.get("refresh_token")
                        })
                        if not user.is_verified:
                            user.is_verified = True
                            self.db.add(user)
                        if self.event_dispatcher:
                            await self.event_dispatcher.dispatch(OAuthLinked(user_id=user.id, provider=provider_name, timestamp=datetime.now(timezone.utc)))
                    else:
                        # Return indicator that user needs to complete registration on the frontend
                        return {
                            "oauth_register": True,
                            "email": email,
                            "provider": provider_name,
                            "provider_account_id": provider_user_id
                        }

                # Check account status exceptions
                if getattr(user, "deleted_at", None) is not None or getattr(user, "status", None) == "deleted":
                    raise ValueError("Account is deleted.")
                if getattr(user, "status", None) == "disabled":
                    raise ValueError("Account is disabled.")
                if getattr(user, "status", None) == "locked":
                    raise ValueError("Account is locked.")

                # MFA Integration Check
                methods = await self.two_factor_repo.get_verified_by_user(self.db, user.id)
                if methods:
                    # Trigger Challenge
                    challenge_jti = uuid4()
                    primary = next((m for m in methods if m.is_primary), methods[0])
                    
                    claims = {
                        "sub": str(user.id),
                        "jti": str(challenge_jti),
                        "typ": "mfa_challenge",
                        "metadata": {
                            "method": primary.method_type,
                            "oauth_provider": provider_name
                        }
                    }
                    challenge_token = self.jwt_manager.create_token(str(user.id), "mfa_challenge", claims)
                    
                    if self.event_dispatcher:
                        await self.event_dispatcher.dispatch(ChallengeCreated(
                            user_id=user.id,
                            challenge_id=challenge_jti,
                            method_type=primary.method_type,
                            timestamp=datetime.now(timezone.utc)
                        ))
                    
                    await self.db.commit()
                    await self.db.refresh(user)
                    return {
                        "mfa_required": True,
                        "challenge_id": challenge_token.token,
                        "user_id": user.id
                    }

                # If MFA is disabled, issue final JWT immediately
                session_id = uuid4()
                await self.session_repo.create_session_record(
                    db=self.db,
                    user_id=user.id,
                    session_id=session_id,
                    device_id=None,
                    duration_minutes=1440 # 24 hours
                )

                from sqlalchemy import inspect
                insp = inspect(user)
                roles_list = [] if "roles" in insp.unloaded else [r.name for r in getattr(user, "roles", [])]
                permissions_list = [] if "permissions" in insp.unloaded else [p.name for p in getattr(user, "permissions", [])]

                custom_claims = {
                    "email": user.email,
                    "username": user.username,
                    "roles": roles_list,
                    "permissions": permissions_list,
                    "session_id": str(session_id),
                    "mfa_verified": False,
                    "authentication_method": f"oauth_{provider_name}",
                    "authentication_level": "aal1"
                }

                token_pair = self.jwt_manager.create_token_pair(str(user.id), custom_claims)
                
                if self.audit:
                    await self.audit.record_security_event("MFA_SUCCESS", user.id, f"OAuth {provider_name} login success")

                await self.db.commit()
                await self.db.refresh(user)
                return {
                    "mfa_required": False,
                    "access_token": token_pair.access_token.token,
                    "refresh_token": token_pair.refresh_token.token,
                    "expires_in": token_pair.access_token.expires_in,
                    "user_id": str(user.id),
                    "email": user.email,
                    "username": user.username,
                    "session_id": str(session_id)
                }
        except Exception as e:
            await self.db.rollback()
            raise e

    async def link_provider_manually(self, user_id: UUID, provider_name: str, provider_user_id: str, email: str) -> None:
        # Check if already linked
        existing = await self.oauth_repo.get_provider(self.db, provider_name, provider_user_id)
        if existing:
            raise ValueError("This OAuth account is already linked to another user.")
            
        user_accounts = await self.oauth_repo.list_accounts(self.db, user_id)
        if any(a.provider == provider_name for a in user_accounts):
            raise ValueError(f"You have already linked a {provider_name} account.")

        await self.oauth_repo.link_account(self.db, {
            "user_id": user_id,
            "provider": provider_name,
            "provider_account_id": provider_user_id,
            "access_token": sha256_hash("manual_token"),
            "refresh_token": None
        })
        if self.event_dispatcher:
            await self.event_dispatcher.dispatch(OAuthLinked(user_id=user_id, provider=provider_name, timestamp=datetime.now(timezone.utc)))
        await self.db.commit()

    async def unlink_provider(self, user_id: UUID, provider_name: str) -> None:
        # Check if unlinking is allowed
        # Rules: User must have at least one password or another OAuth account, otherwise they'll be locked out!
        # Let's count active oauth accounts:
        accounts = await self.oauth_repo.list_accounts(self.db, user_id)
        has_provider = any(a.provider == provider_name for a in accounts)
        if not has_provider:
            raise ValueError(f"You do not have a {provider_name} account linked.")

        user = await self.user_repo.get_by_id(self.db, user_id)
        # If user has no password and this is their only OAuth provider, reject!
        if (not user.hashed_password or user.hashed_password == "$argon2id$v=19$m=65536,t=3,p=4$ZHVtbXlzYWx0$dummyhash") and len(accounts) <= 1:
            raise ValueError("Cannot unlink the only login method. Please set a password or link another account first.")

        await self.oauth_repo.unlink_account(self.db, user_id, provider_name)

        if self.audit:
            await self.audit.record_security_event("TRUSTED_DEVICE_REMOVED", user_id, f"OAuth {provider_name} unlinked")
        await self.db.commit()

    async def get_linked_accounts(self, user_id: UUID) -> List[Dict[str, Any]]:
        accounts = await self.oauth_repo.list_accounts(self.db, user_id)
        return [{
            "id": a.id,
            "provider": a.provider,
            "provider_account_id": a.provider_account_id,
            "created_at": a.created_at
        } for a in accounts]
