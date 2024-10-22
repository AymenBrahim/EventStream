from typing import Union
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from datetime import datetime, timedelta
from config import server_settings


from passlib.context import CryptContext
import jwt
from jwt.exceptions import InvalidTokenError

from api.models.user import UserInformation

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

auth_secret_key = server_settings.auth_secret_key
auth_algorithm = server_settings.auth_algorithm
access_token_expiration_minutes = server_settings.access_token_expiration_minutes

unauthrized_response_dict = {
    "status_code": status.HTTP_401_UNAUTHORIZED,
    "headers": {"WWW-Authenticate": "Bearer"},
}


def verify_hash(plain_text: str, hash: str):
    return pwd_context.verify(plain_text, hash)


def calculate_hash(password):
    return pwd_context.hash(password)


def encode_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=access_token_expiration_minutes)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, auth_secret_key, algorithm=auth_algorithm)
    return encoded_jwt


def decode_access_token(
    token: str,
):
    try:
        payload = jwt.decode(token, auth_secret_key, algorithms=[auth_algorithm])
        return UserInformation(**payload)
    except InvalidTokenError:
        raise HTTPException(**unauthrized_response_dict)
