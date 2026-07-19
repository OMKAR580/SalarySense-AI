import time
import httpx
import urllib.parse
from typing import Dict, Any, Optional
from jose import jwt
from app.Auth.auth.oauth.base import OAuthProvider

class AppleOAuthProvider(OAuthProvider):
    def __init__(self, client_id: str, team_id: str, key_id: str, private_key: Optional[str] = None):
        self.client_id = client_id
        self.team_id = team_id
        self.key_id = key_id
        self.apple_private_key = private_key

    def generate_client_secret(self) -> str:
        if not self.apple_private_key:
            return "dummy_apple_client_secret"
        now = int(time.time())
        headers = {
            "alg": "ES256",
            "kid": self.key_id
        }
        payload = {
            "iss": self.team_id,
            "iat": now,
            "exp": now + 86400 * 30,
            "aud": "https://appleid.apple.com",
            "sub": self.client_id
        }
        return jwt.encode(payload, self.apple_private_key, algorithm="ES256", headers=headers)

    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code id_token",
            "scope": "name email",
            "response_mode": "form_post",
            "state": state
        }
        return "https://appleid.apple.com/auth/authorize?" + urllib.parse.urlencode(params)

    async def exchange_code(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None) -> Dict[str, Any]:
        client_secret = self.generate_client_secret()
        async with httpx.AsyncClient() as client:
            data = {
                "client_id": self.client_id,
                "client_secret": client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code"
            }
            response = await client.post("https://appleid.apple.com/auth/token", data=data)
            if response.status_code != 200:
                raise ValueError(f"Failed to exchange Apple OAuth code: {response.text}")
            return response.json()

    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        id_token = token_payload.get("id_token")
        if not id_token:
            raise ValueError("id_token not found in Apple token exchange response.")
        
        claims = jwt.get_unverified_claims(id_token)
        return {
            "id": claims.get("sub"),
            "email": claims.get("email"),
            "name": claims.get("email", "").split("@")[0] if claims.get("email") else "Apple User",
            "avatar": None
        }
