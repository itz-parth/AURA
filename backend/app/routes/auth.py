from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy import select

from app.core.config import SECRET_KEY, ALGORITHM
from app.core.security import (
    oauth2_scheme,
    verify_password,
    get_password_hash,
    create_access_token,
)
from app.database.connection import async_session
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest

router = APIRouter()


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == username))
        user = result.scalar_one_or_none()
        if user is None:
            raise credentials_exception
        return user


@router.post("/register")
async def register(req: RegisterRequest):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == req.username))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Username already registered")
        result = await session.execute(select(User).where(User.email == req.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(
            username=req.username,
            email=req.email,
            hashed_password=get_password_hash(req.password),
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return {"id": str(user.id), "username": user.username, "email": user.email}


@router.post("/login")
async def login(req: LoginRequest):
    async with async_session() as session:
        result = await session.execute(select(User).where(User.username == req.username))
        user = result.scalar_one_or_none()
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(
                status_code=400, detail="Incorrect username or password"
            )
        access_token = create_access_token(data={"sub": user.username})
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "id": str(user.id),
            "username": user.username,
            "email": user.email,
        }
