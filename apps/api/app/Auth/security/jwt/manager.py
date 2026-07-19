import jwt
import datetime
from typing import Optional, Dict, Any, List
from app.Auth.config.jwt_settings import jwt_config
from app.Auth.security.jwt.exceptions import (
    InvalidJWT, ExpiredJWT, MalformedJWT, InvalidSignature, 
    InvalidIssuer, InvalidAudience, InvalidClaims, UnsupportedAlgorithm,
    TokenCreationFailed, TokenValidationFailed
)
from app.Auth.security.jwt.models import (
    JWTClaims, TokenMetadata, DecodedToken, TokenValidationResult, TokenPair
)
from app.Auth.security.jwt.keys import KeyManager, SharedSecretKeyManager
from app.Auth.security.jwt.utils import generate_jti
from app.Auth.security.tokens.provider import TokenProvider

class JWTManager(TokenProvider):
    def __init__(self, key_manager: Optional[KeyManager] = None):
        self.key_manager = key_manager or SharedSecretKeyManager()
        self.algorithm = jwt_config.jwt_algorithm
        self.issuer = jwt_config.jwt_issuer
        self.audience = jwt_config.jwt_audience
        self.clock_skew = jwt_config.jwt_clock_skew_seconds

    def _build_payload(
        self, 
        subject: str, 
        token_type: str, 
        expires_delta: datetime.timedelta, 
        custom_claims: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        now = datetime.datetime.now(datetime.timezone.utc)
        jti = generate_jti()
        
        payload = {
            "sub": subject,
            "iss": self.issuer,
            "aud": self.audience,
            "iat": int(now.timestamp()),
            "exp": int((now + expires_delta).timestamp()),
            "nbf": int(now.timestamp()),
            "jti": jti,
            "typ": token_type
        }
        
        if custom_claims:
            protected = {"sub", "iss", "aud", "iat", "exp", "nbf", "jti", "typ"}
            for k, v in custom_claims.items():
                if k not in protected:
                    payload[k] = v
                    
        return payload

    def _create_token(self, payload: Dict[str, Any]) -> TokenMetadata:
        try:
            token = jwt.encode(
                payload, 
                self.key_manager.get_signing_key(), 
                algorithm=self.algorithm
            )
            expires_at = datetime.datetime.fromtimestamp(payload["exp"], tz=datetime.timezone.utc)
            now = datetime.datetime.now(datetime.timezone.utc)
            expires_in = int((expires_at - now).total_seconds())
            
            return TokenMetadata(
                token=token,
                token_type=payload["typ"],
                expires_in=expires_in,
                expires_at=expires_at,
                jti=payload["jti"]
            )
        except Exception as e:
            raise TokenCreationFailed(f"Failed to create token: {e}")

    def create_token(self, subject: str, token_type: str, custom_claims: Optional[Dict[str, Any]] = None) -> TokenMetadata:
        delta = datetime.timedelta(minutes=jwt_config.jwt_access_expiration_minutes)
        if token_type == "refresh":
            delta = datetime.timedelta(days=jwt_config.jwt_refresh_expiration_days)
        elif token_type in ("password_reset", "PASSWORD_RESET"):
            from app.Auth.config.password_settings import password_settings
            delta = datetime.timedelta(minutes=password_settings.reset_expiration_minutes)
        elif token_type in ("email_verification", "EMAIL_VERIFICATION"):
            from app.Auth.config.verification_settings import verification_settings
            delta = datetime.timedelta(minutes=verification_settings.VERIFICATION_TOKEN_LIFETIME_MINUTES)
        elif token_type == "mfa_challenge":
            delta = datetime.timedelta(minutes=5)
        payload = self._build_payload(subject, token_type, delta, custom_claims)
        return self._create_token(payload)

    def create_access_token(self, subject: str, custom_claims: Optional[Dict[str, Any]] = None) -> TokenMetadata:
        return self.create_token(subject, "access", custom_claims)

    def create_refresh_token(self, subject: str, custom_claims: Optional[Dict[str, Any]] = None) -> TokenMetadata:
        return self.create_token(subject, "refresh", custom_claims)

    def create_token_pair(self, subject: str, custom_claims: Optional[Dict[str, Any]] = None) -> TokenPair:
        access = self.create_access_token(subject, custom_claims)
        refresh = self.create_refresh_token(subject, custom_claims)
        return TokenPair(access_token=access, refresh_token=refresh)

    def verify_signature(self, token: str) -> Dict[str, Any]:
        try:
            header = jwt.get_unverified_header(token)
            if header.get("alg") != self.algorithm:
                raise UnsupportedAlgorithm(f"Algorithm {header.get('alg')} is not supported.")
                
            payload = jwt.decode(
                token,
                self.key_manager.get_verifying_key(),
                algorithms=[self.algorithm],
                issuer=self.issuer,
                audience=self.audience,
                leeway=self.clock_skew
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise ExpiredJWT("Token has expired.")
        except jwt.InvalidIssuerError:
            raise InvalidIssuer("Invalid issuer.")
        except jwt.InvalidAudienceError:
            raise InvalidAudience("Invalid audience.")
        except jwt.InvalidSignatureError:
            raise InvalidSignature("Invalid signature.")
        except jwt.DecodeError:
            raise MalformedJWT("Malformed token.")
        except Exception as e:
            raise InvalidJWT(f"Invalid token: {e}")

    def extract_claims(self, payload: Dict[str, Any]) -> JWTClaims:
        try:
            return JWTClaims(
                sub=payload["sub"],
                iss=payload["iss"],
                aud=payload["aud"],
                iat=payload["iat"],
                exp=payload["exp"],
                nbf=payload.get("nbf"),
                jti=payload.get("jti"),
                typ=payload.get("typ", "access"),
                user_id=payload.get("user_id"),
                email=payload.get("email"),
                username=payload.get("username"),
                roles=payload.get("roles", []),
                permissions=payload.get("permissions", []),
                organization_id=payload.get("organization_id"),
                device_id=payload.get("device_id"),
                session_id=payload.get("session_id"),
                ver=payload.get("ver"),
                scope=payload.get("scope"),
                nonce=payload.get("nonce"),
                trace_id=payload.get("trace_id"),
                request_id=payload.get("request_id"),
                tenant_id=payload.get("tenant_id"),
                client_id=payload.get("client_id"),
                auth_method=payload.get("auth_method"),
                auth_level=payload.get("auth_level"),
                device_trust=payload.get("device_trust"),
                risk_score=payload.get("risk_score"),
                token_family=payload.get("token_family"),
                rotation_counter=payload.get("rotation_counter"),
                mfa_verified=payload.get("mfa_verified", False),
                authentication_method=payload.get("authentication_method"),
                authentication_level=payload.get("authentication_level"),
                trusted_device=payload.get("trusted_device", False),
                metadata=payload.get("metadata", {})
            )
        except KeyError as e:
            raise InvalidClaims(f"Missing required claim: {e}")

    def decode_token(self, token: str) -> DecodedToken:
        payload = self.verify_signature(token)
        claims = self.extract_claims(payload)
        header = jwt.get_unverified_header(token)
        return DecodedToken(header=header, payload=payload, claims=claims)

    def validate_token(self, token: str, expected_type: Optional[str] = None) -> TokenValidationResult:
        try:
            decoded = self.decode_token(token)
            if expected_type and decoded.claims.typ != expected_type:
                return TokenValidationResult(is_valid=False, error=f"Expected token type '{expected_type}' but got '{decoded.claims.typ}'.")
            return TokenValidationResult(is_valid=True, claims=decoded.claims)
        except Exception as e:
            return TokenValidationResult(is_valid=False, error=str(e))
            
    def revoke_token(self, token: str) -> bool:
        # Placeholder for future phase
        return True
    
    def refresh_token(self, refresh_token: str) -> Any:
        # Placeholder for future phase
        return None
