from sqlalchemy.orm import Session
from db.models.pydantic_models import UserCreate
from db.models.sqlalchemy_models import Users
from utils.exceptions import UserAlreadyExistsException, InvalidCredentialException
from services.oauth import hash_password, create_access_token, verify_password
from fastapi.security import OAuth2PasswordRequestForm
from utils.db_utils import get_user_by_username


def create_user(user: UserCreate, db: Session) -> dict:
    existing_user = get_user_by_username(user.username, db)
    if existing_user:
        raise UserAlreadyExistsException(f"User '{user.username}' already exists.")

    new_user = Users(
        username=user.username,
        role=user.role.value,
        email=user.email,
        phone_number=user.phone_number,
        password_hash=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(data={"sub": new_user.username, "role": new_user.role})
    return {"access_token": access_token, "token_type": "bearer", "role": new_user.role}


def authenticate_user(user: OAuth2PasswordRequestForm, db: Session) -> dict:
    user_detail = get_user_by_username(user.username, db)
    if not user_detail or not verify_password(user.password, user_detail.password_hash):
        raise InvalidCredentialException("Invalid username or password.")

    access_token = create_access_token(data={"sub": user_detail.username, "role": user_detail.role})
    return {"access_token": access_token, "token_type": "bearer", "role": user_detail.role}
