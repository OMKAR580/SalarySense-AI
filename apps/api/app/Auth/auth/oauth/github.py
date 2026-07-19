import httpx
import urllib.parse
from typing import Dict, Any, Optional
from app.Auth.auth.oauth.base import OAuthProvider

class GitHubOAuthProvider(OAuthProvider):
    def __init__(self, client_id: str, client_secret: str):
        self.client_id = client_id
        self.client_secret = client_secret

    def get_authorization_url(self, redirect_uri: str, state: str, code_challenge: Optional[str] = None) -> str:
        params = {
            "client_id": self.client_id,
            "redirect_uri": redirect_uri,
            "state": state,
            "scope": "read:user user:email"
        }
        return "https://github.com/login/oauth/authorize?" + urllib.parse.urlencode(params)

    async def exchange_code(self, code: str, redirect_uri: str, code_verifier: Optional[str] = None) -> Dict[str, Any]:
        async with httpx.AsyncClient() as client:
            headers = {"Accept": "application/json"}
            data = {
                "client_id": self.client_id,
                "client_secret": self.client_secret,
                "code": code,
                "redirect_uri": redirect_uri
            }
            response = await client.post("https://github.com/login/oauth/access_token", data=data, headers=headers)
            if response.status_code != 200:
                raise ValueError(f"Failed to exchange GitHub OAuth code: {response.text}")
            return response.json()

    async def get_user_info(self, token_payload: Dict[str, Any]) -> Dict[str, Any]:
        access_token = token_payload.get("access_token")
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"token {access_token}",
                "User-Agent": "RajAuth"
            }
            response = await client.get("https://api.github.com/user", headers=headers)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch GitHub user info: {response.text}")
            profile = response.json()
            
            email = profile.get("email")
            if not email:
                email_response = await client.get("https://api.github.com/user/emails", headers=headers)
                if email_response.status_code == 200:
                    emails = email_response.json()
                    primary_email = next((e.get("email") for e in emails if e.get("primary")), None)
                    if primary_email:
                        email = primary_email
            
            return {
                "id": str(profile.get("id")),
                "email": email,
                "name": profile.get("name") or profile.get("login"),
                "avatar": profile.get("avatar_url")
            }
