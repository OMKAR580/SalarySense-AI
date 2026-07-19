from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.Auth.api.deps import get_db
from app.Auth.models.user import User
from app.Auth.models.organization import Organization
from app.Auth.models.organization_member import OrganizationMember
from app.Auth.schemas.admin_user import (
    AdminUserListResponse, AdminUserDetailResponse, AdminUserPatchRequest
)
from app.Auth.api.deps.rbac_deps import require_permission
from app.Auth.api.deps.org_deps import get_user_service
from app.Auth.services.user_service import UserService
from app.Auth.services.rbac_service import RbacService

router = APIRouter()

@router.get("", response_model=List[AdminUserListResponse], status_code=status.HTTP_200_OK, summary="List Users", description="Retrieve lists of users with paginated, filtered, and search matches.")
async def list_users(
    page: int = 1,
    limit: int = 20,
    search: str = None,
    current_user: User = require_permission("users:read"),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service)
):
    return await user_service.list_users(db, page=page, limit=limit, search=search)

@router.get("/{id}", response_model=AdminUserDetailResponse, status_code=status.HTTP_200_OK, summary="Get User Details", description="Retrieve detailed user profile, permissions, roles, and organizations list.")
async def get_user_detail(
    id: UUID,
    current_user: User = require_permission("users:read"),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service)
):
    try:
        user = await user_service.get_user_detail(db, id)
        rbac = RbacService(db)
        roles = await rbac.get_user_roles(user.id)
        permissions = await rbac.get_user_permissions(user.id)

        # Get organizations
        org_query = select(Organization).join(
            OrganizationMember, OrganizationMember.organization_id == Organization.id
        ).filter(OrganizationMember.user_id == user.id)
        res_orgs = await db.execute(org_query)
        orgs = list(res_orgs.scalars().all())

        return AdminUserDetailResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            roles=[{"id": r.id, "name": r.name, "description": r.description} for r in roles],
            permissions=permissions,
            organizations=[{"id": o.id, "name": o.name, "slug": o.slug} for o in orgs]
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{id}", response_model=AdminUserListResponse, status_code=status.HTTP_200_OK, summary="Update User Settings", description="Modify user settings, metadata, status, or assign roles.")
async def update_user(
    id: UUID,
    request: AdminUserPatchRequest,
    current_user: User = require_permission("users:update"),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service)
):
    try:
        return await user_service.update_user(
            db=db,
            user_id=id,
            actor_id=current_user.id,
            is_active=request.is_active,
            is_verified=request.is_verified,
            role_ids=request.role_ids,
            metadata=request.metadata
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_200_OK, summary="Soft Delete User", description="Soft delete user account from the system.")
async def delete_user(
    id: UUID,
    current_user: User = require_permission("users:delete"),
    db: AsyncSession = Depends(get_db),
    user_service: UserService = Depends(get_user_service)
):
    try:
        await user_service.delete_user(db, user_id=id, actor_id=current_user.id)
        return {"status": "success", "message": "User deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
