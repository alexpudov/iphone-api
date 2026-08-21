from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db import get_db
from app.models import User
from app.schemas import UserCreate, UserOut, TokenOut, UserLogin
from app.security import hash_password

from app.dependencies import get_current_user

from app.security import verify_password, create_access_token

from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)


@router.post("/register", response_model=UserOut)
def register_user(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="User with this email already exists",
        )

    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role="user",
    )

    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="User with this email already exists"
    )

    db.refresh(user)

    return user

@router.post("/login", response_model=TokenOut)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(user.id)

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserOut)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user