from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from typing import List

from app.Auth.models.user import User
from app.Auth.schemas.organization import (
    OrganizationCreate, OrganizationUpdate, OrganizationResponse,
    OrganizationMemberResponse, MemberInviteRequest, MemberRoleChangeRequest
)
from app.Auth.api.deps.rbac_deps import require_permission, get_current_user
from app.Auth.api.deps.org_deps import get_org_service
from app.Auth.services.organization_service import OrganizationService

router = APIRouter()

@router.post("", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED, summary="Create Organization", description="Create a new SaaS organization/tenant.")
async def create_organization(
    request: OrganizationCreate,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        return await org_service.create_organization(
            name=request.name,
            slug=request.slug,
            owner_id=current_user.id,
            description=request.description
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("", response_model=List[OrganizationResponse], status_code=status.HTTP_200_OK, summary="List Organizations", description="List all active organizations.")
async def list_organizations(
    page: int = 1,
    limit: int = 20,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    return await org_service.list_organizations(page=page, limit=limit)

@router.get("/{id}", response_model=OrganizationResponse, status_code=status.HTTP_200_OK, summary="Get Organization Details", description="Retrieve organization profile by ID.")
async def get_organization(
    id: UUID,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        return await org_service.get_organization(id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.patch("/{id}", response_model=OrganizationResponse, status_code=status.HTTP_200_OK, summary="Update Organization", description="Modify organization details.")
async def update_organization(
    id: UUID,
    request: OrganizationUpdate,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        return await org_service.update_organization(
            org_id=id,
            actor_id=current_user.id,
            name=request.name,
            slug=request.slug,
            description=request.description,
            is_active=request.is_active
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{id}", status_code=status.HTTP_200_OK, summary="Delete Organization", description="Soft-delete an organization.")
async def delete_organization(
    id: UUID,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        await org_service.delete_organization(org_id=id, actor_id=current_user.id)
        return {"status": "success", "message": "Organization deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

# --- Membership Management ---

@router.post("/{id}/members", response_model=OrganizationMemberResponse, status_code=status.HTTP_201_CREATED, summary="Invite Member", description="Invite a user to the organization.")
async def invite_member(
    id: UUID,
    request: MemberInviteRequest,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        return await org_service.invite_user(
            org_id=id,
            email=request.email,
            role_id=request.role_id,
            invited_by=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete("/{id}/members/{user_id}", status_code=status.HTTP_200_OK, summary="Remove Member", description="Remove a user from the organization.")
async def remove_member(
    id: UUID,
    user_id: UUID,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        await org_service.remove_user_from_org(
            org_id=id,
            user_id=user_id,
            actor_id=current_user.id
        )
        return {"status": "success", "message": "Member removed successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.patch("/{id}/members/{user_id}/role", response_model=OrganizationMemberResponse, status_code=status.HTTP_200_OK, summary="Change Member Role", description="Change a member's role within the organization.")
async def change_member_role(
    id: UUID,
    user_id: UUID,
    request: MemberRoleChangeRequest,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    try:
        return await org_service.change_member_role(
            org_id=id,
            user_id=user_id,
            role_id=request.role_id,
            actor_id=current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get("/{id}/members", response_model=List[OrganizationMemberResponse], status_code=status.HTTP_200_OK, summary="List Members", description="List all organization members.")
async def list_members(
    id: UUID,
    current_user: User = require_permission("organization:manage"),
    org_service: OrganizationService = Depends(get_org_service)
):
    return await org_service.list_members(org_id=id)
