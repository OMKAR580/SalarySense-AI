from fastapi import APIRouter

from app.Auth.api.endpoints import health
from app.Auth.api.v1.endpoints import auth, auth_login, admin_rbac, admin_users, admin_audit, organizations, profile

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(auth_login.router, prefix="/auth", tags=["auth"])
api_router.include_router(admin_rbac.router, prefix="/admin", tags=["admin"])
api_router.include_router(admin_users.router, prefix="/admin/users", tags=["admin"])
api_router.include_router(admin_audit.router, prefix="/admin/audit-logs", tags=["admin"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(profile.router, prefix="/profile", tags=["profile"])
