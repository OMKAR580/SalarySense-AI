from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List
from sqlalchemy import select

from app.Auth.models.user import User
from app.Auth.models.role import Role
from app.Auth.models.permission import Permission
from app.Auth.schemas.rbac import (
    RoleCreate, RoleUpdate, RoleResponse, 
    PermissionCreate, PermissionResponse, RoleAssignmentRequest
)
from app.Auth.api.deps.rbac_deps import get_rbac_service, require_permission
from app.Auth.services.rbac_service import RbacService

router = APIRouter()

# --- Role Management ---

@router.post("/roles", response_model=RoleResponse, status_code=status.HTTP_201_CREATED)
async def create_role(
    request: RoleCreate,
    current_user: User = require_permission("roles:create"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        return await rbac_service.create_role(request.name, request.description, request.is_system)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/roles", response_model=List[RoleResponse], status_code=status.HTTP_200_OK)
async def get_roles(
    current_user: User = require_permission("roles:read"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    query = select(Role)
    res = await rbac_service.db.execute(query)
    return list(res.scalars().all())

@router.patch("/roles/{id}", response_model=RoleResponse, status_code=status.HTTP_200_OK)
async def update_role(
    id: UUID,
    request: RoleUpdate,
    current_user: User = require_permission("roles:update"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    query = select(Role).filter(Role.id == id)
    res = await rbac_service.db.execute(query)
    role = res.scalars().first()
    if not role:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Role not found")
    if role.is_system:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="System roles cannot be modified")
    
    if request.description is not None:
        role.description = request.description
    rbac_service.db.add(role)
    await rbac_service.db.flush()
    return role

@router.delete("/roles/{id}", status_code=status.HTTP_200_OK)
async def delete_role(
    id: UUID,
    current_user: User = require_permission("roles:delete"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        await rbac_service.delete_role(id)
        return {"status": "success", "message": "Role deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# --- Permission Management ---

@router.post("/permissions", response_model=PermissionResponse, status_code=status.HTTP_201_CREATED)
async def create_permission(
    request: PermissionCreate,
    current_user: User = require_permission("permissions:create"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        return await rbac_service.add_permission(request.resource, request.action, request.description)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/permissions", response_model=List[PermissionResponse], status_code=status.HTTP_200_OK)
async def get_permissions(
    current_user: User = require_permission("permissions:read"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    query = select(Permission)
    res = await rbac_service.db.execute(query)
    return list(res.scalars().all())

# --- User Role Assignment ---

@router.post("/users/{user_id}/roles", status_code=status.HTTP_200_OK)
async def assign_user_role(
    user_id: UUID,
    request: RoleAssignmentRequest,
    current_user: User = require_permission("users:roles:assign"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        await rbac_service.assign_role_to_user(
            user_id=user_id,
            role_id=request.role_id,
            assigned_by=current_user.id,
            expires_at=request.expires_at
        )
        return {"status": "success", "message": "Role assigned successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/users/{user_id}/roles/{role_id}", status_code=status.HTTP_200_OK)
async def remove_user_role(
    user_id: UUID,
    role_id: UUID,
    current_user: User = require_permission("users:roles:remove"),
    rbac_service: RbacService = Depends(get_rbac_service)
):
    try:
        await rbac_service.remove_role_from_user(user_id, role_id, current_user.id)
        return {"status": "success", "message": "Role removed successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
