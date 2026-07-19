from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID
from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.Auth.api.deps import get_db
from app.Auth.models.user import User
from app.Auth.models.audit_log import AuditLog
from app.Auth.schemas.audit_log import AdminAuditLogResponse
from app.Auth.api.deps.rbac_deps import require_permission

router = APIRouter()

@router.get("", response_model=List[AdminAuditLogResponse], status_code=status.HTTP_200_OK, summary="Get Audit Logs", description="Search, page, and filter security audit logs.")
async def list_audit_logs(
    page: int = 1,
    limit: int = 20,
    action: Optional[str] = None,
    user_id: Optional[UUID] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    current_user: User = require_permission("audit:read"),
    db: AsyncSession = Depends(get_db)
):
    query = select(AuditLog)
    if action:
        query = query.filter(AuditLog.action == action)
    if user_id:
        query = query.filter(AuditLog.actor_id == user_id)
    if start_date:
        query = query.filter(AuditLog.created_at >= start_date)
    if end_date:
        query = query.filter(AuditLog.created_at <= end_date)
    
    query = query.order_by(AuditLog.created_at.desc()).offset((page - 1) * limit).limit(limit)
    res = await db.execute(query)
    return list(res.scalars().all())
