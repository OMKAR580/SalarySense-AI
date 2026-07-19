import httpx
import urllib.parse
from typing import Dict, Any, Optional
from app.Auth.auth.oauth.base import OAuthProvider

class GoogleOAuthProvider(OAuthProvider):
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret

    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "offline",
            "prompt": "consent"
        }
        if code_challenge:
            params["code_challenge"] = code_challenge
            params["code_challenge_method"] = "S256"
            
        full_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
        return full_url

    async def exchange_code(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            data = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code"
            }
            if code_verifier:
                data["code_verifier"] = code_verifier
            response = await client.post("https://oauth2.googleapis.com/token", data=data)
            if response.status_code != 200:
                raise ValueError(f"Failed to exchange Google OAuth code: {response.text}")
            return response.json()

    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        access_token = token_payload.get("access_token")
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", headers=headers)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch Google user info: {response.text}")
            data = response.json()
            return {
                "id": data.get("sub"),
                "email": data.get("email"),
                "name": data.get("name"),
                "avatar": data.get("picture")
            }
