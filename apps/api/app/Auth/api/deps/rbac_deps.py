from fastapi import Depends, HTTPException, status, Request
from app.Auth.api.deps import get_db
from app.Auth.api.deps.recovery_deps import get_current_user
from app.Auth.services.rbac_service import RbacService
from app.Auth.models.user import User
from app.Auth.core.rate_limit import enforce_admin_rate_limit

async def get_rbac_service(db = Depends(get_db)) -> RbacService:
    return RbacService(db)

from typing import Optional

class PermissionRequired:
    def __init__(self, permission_name: str):
        self.permission_name = permission_name

    async def __call__(
        self,
        request: Request,
        current_user: User = Depends(get_current_user),
        rbac_service: RbacService = Depends(get_rbac_service)
    ) -> User:
        # Enforce rate limit for admin operations
        if request is not None:
            await enforce_admin_rate_limit(request, current_user)
        
        has_perm = await rbac_service.check_permission(current_user.id, self.permission_name)
        if not has_perm:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "insufficient_permissions",
                    "required_permission": self.permission_name
                }
            )
        return current_user

def require_permission(permission_name: str):
    return Depends(PermissionRequired(permission_name))
