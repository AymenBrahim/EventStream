import uuid

from pydantic import BaseModel, ConfigDict, Field
import datetime


class Base(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserSigninPayload(Base):
    email: str = Field(min_length=1, max_length=128)
    password: str = Field(min_length=1, max_length=128)


class UserSignupPayload(UserSigninPayload):
    username: str = Field(min_length=1, max_length=128)


class User(Base):
    username: str
    email: str


class UserInformation(Base):
    id: str
    username: str
    email: str


class UserResponse(UserInformation):
    access_token: str
