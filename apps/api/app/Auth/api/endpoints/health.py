from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.Auth.database.session import get_db_session

router = APIRouter()


@router.get("/", response_model=dict)
async def check_health(db: AsyncSession = Depends(get_db_session)) -> Any:
    """
    Health check endpoint.
    Verifies that the application can handle requests and can connect to the database.
    """
    try:
        # Check database connection
        await db.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {str(e)}"
        
    return {
        "status": "ok",
        "database": db_status
    }
