import httpx
import urllib.parse
from typing import Dict, Any, Optional
from app.Auth.auth.oauth.base import OAuthProvider

class FacebookOAuthProvider(OAuthProvider):
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret

    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "state": state,
            "scope": "email public_profile"
        }
        return "https://www.facebook.com/v18.0/dialog/oauth?" + urllib.parse.urlencode(params)

    async def exchange_code(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None) -> Dict[str, Any]:
        if self.client_id.startswith("dummy_"):
            return {"access_token": "mock_facebook_access_token"}
        async with httpx.AsyncClient() as client:
            params = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "redirect_uri": redirect_uri,
                "code": code
            }
            response = await client.get("https://graph.facebook.com/v18.0/oauth/access_token", params=params)
            if response.status_code != 200:
                raise ValueError(f"Failed to exchange Facebook OAuth code: {response.text}")
            return response.json()

    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        if self.client_id.startswith("dummy_"):
            return {
                "id": "mock_facebook_id_12345",
                "email": "mock.facebook.user@example.com",
                "name": "Mock Facebook User",
                "avatar": None
            }
        access_token = token_payload.get("access_token")
        async with httpx.AsyncClient() as client:
            params = {
                "fields": "id,name,email,picture",
                "access_token": access_token
            }
            response = await client.get("https://graph.facebook.com/me", params=params)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch Facebook user info: {response.text}")
            data = response.json()
            return {
                "id": data.get("id"),
                "email": data.get("email"),
                "name": data.get("name"),
                "avatar": data.get("picture", {}).get("data", {}).get("url") if data.get("picture") else None
            }
