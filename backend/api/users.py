from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from db.sessions import get_db
from db.models.pydantic_models import Token, UserCreate, UserResponse
from services.users_services import create_user, authenticate_user
from services.oauth import get_current_user
from utils.exceptions import UserAlreadyExistsException, InvalidCredentialException

users_router = APIRouter(
    prefix="/users",
    tags=["User"],
    responses={404: {"description": "Not found"}},
)


@users_router.get("/me", response_model=UserResponse, description="Get current authenticated user.")
async def read_me(current_user: dict = Depends(get_current_user)):
    return current_user


@users_router.post("/add-user", response_model=Token, description="Create a new staff user.")
async def add_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return create_user(user=user, db=db)
    except UserAlreadyExistsException as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")


@users_router.post("/login", response_model=Token, description="Authenticate and get access token.")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        return authenticate_user(user=form_data, db=db)
    except InvalidCredentialException as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Internal server error")
