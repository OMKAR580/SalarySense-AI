import os
import time
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.Auth.database.session import get_db_session
from app.Auth.api.deps.recovery_deps import get_current_user
from app.Auth.models.user import User
from app.Auth.security.password import PasswordHasher

router = APIRouter()
password_hasher = PasswordHasher()

class UpdateProfileRequest(BaseModel):
    username: str
    email: str

class UpdatePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class DeleteAccountRequest(BaseModel):
    password: str

@router.put("/", status_code=status.HTTP_200_OK)
async def update_profile(
    request: UpdateProfileRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    try:
        current_user.username = request.username
        current_user.email = request.email
        await db.commit()
        await db.refresh(current_user)
        return {"status": "success", "username": current_user.username, "email": current_user.email}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email or username might already be in use.")

@router.put("/password", status_code=status.HTTP_200_OK)
async def update_password(
    request: UpdatePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    if not current_user.password_hash:
        raise HTTPException(status_code=400, detail="User has no password set (OAuth login only).")
        
    if not password_hasher.verify_password(request.current_password, current_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect current password.")

    current_user.password_hash = password_hasher.hash_password(request.new_password)
    await db.commit()
    return {"status": "success"}

@router.post("/avatar", status_code=status.HTTP_200_OK)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    # Ensure static directory exists
    static_dir = os.path.abspath(os.path.join(os.getcwd(), "static/avatars"))
    os.makedirs(static_dir, exist_ok=True)
    
    file_extension = file.filename.split(".")[-1]
    filename = f"{current_user.id}.{file_extension}"
    file_path = os.path.join(static_dir, filename)
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    avatar_url = f"/api/v1/profile/avatars/{filename}?t={int(time.time())}"
    current_user.avatar = avatar_url
    await db.commit()
    await db.refresh(current_user)
    
    return {"status": "success", "avatar_url": avatar_url}

@router.delete("/", status_code=status.HTTP_200_OK)
async def delete_account(
    request: DeleteAccountRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session)
):
    if current_user.password_hash:
        if not password_hasher.verify_password(request.password, current_user.password_hash):
            raise HTTPException(status_code=400, detail="Incorrect password.")
    else:
        # OAuth users might not have a password hash
        if request.password != "OAUTH_CONFIRM":
             raise HTTPException(status_code=400, detail="Please type OAUTH_CONFIRM to delete OAuth account.")
    
    await db.delete(current_user)
    await db.commit()
    return {"status": "success"}

@router.get("/avatars/{filename}")
async def get_avatar(filename: str):
    file_path = os.path.abspath(os.path.join(os.getcwd(), "static/avatars", filename))
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Avatar not found")
    return FileResponse(file_path)
