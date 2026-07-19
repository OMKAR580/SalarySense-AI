import httpx
import urllib.parse
from typing import Dict, Any, Optional
from app.Auth.auth.oauth.base import OAuthProvider

class MicrosoftOAuthProvider(OAuthProvider):
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret

    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "response_mode": "query",
            "scope": "openid email profile User.Read",
            "state": state
        }
        if code_challenge:
            params["code_challenge"] = code_challenge
            params["code_challenge_method"] = "S256"
        return "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" + urllib.parse.urlencode(params)

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
            response = await client.post("https://login.microsoftonline.com/common/oauth2/v2.0/token", data=data)
            if response.status_code != 200:
                raise ValueError(f"Failed to exchange Microsoft OAuth code: {response.text}")
            return response.json()

    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        access_token = token_payload.get("access_token")
        async with httpx.AsyncClient() as client:
            headers = {"Authorization": f"Bearer {access_token}"}
            response = await client.get("https://graph.microsoft.com/v1.0/me", headers=headers)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch Microsoft user info: {response.text}")
            data = response.json()
            return {
                "id": data.get("id"),
                "email": data.get("mail") or data.get("userPrincipalName"),
                "name": data.get("displayName"),
                "avatar": None
            }
