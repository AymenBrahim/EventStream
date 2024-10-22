import json

from fastapi import HTTPException, Response
from fastapi.responses import JSONResponse

from sqlalchemy import or_

import api.security as security
from database import repositories
import api.models.user as user_models
from database import models as models


async def create_user(
    repository: repositories.UserRepository, data: user_models.UserSignupPayload
):
    if await repository.find(
        or_(models.User.email == data.email, models.User.username == data.username)
    ):
        raise HTTPException(status_code=400)

    data.password = security.calculate_hash(data.password)
    user = await repository.create(data.model_dump())
    access_token = security.encode_access_token(
        {"id": str(user.id), "username": user.username, "email": user.email}
    )

    content = user_models.UserResponse(
        access_token=access_token,
        id=str(user.id),
        username=user.username,
        email=user.email,
    )

    content = content.model_dump()
    return JSONResponse(content, status_code=201)


async def authenticate_user(
    repository: repositories.UserRepository,
    data: user_models.UserSignupPayload,
):
    try:
        db_user = await get_user_by_email(repository, data.email)
    except:
        pass
    if not db_user:
        return Response(**security.unauthrized_response_dict)

    if not security.verify_hash(data.password, db_user.password):
        return Response(**security.unauthrized_response_dict)

    access_token = security.encode_access_token(
        {"id": str(db_user.id), "username": db_user.username, "email": db_user.email}
    )

    content = user_models.UserResponse(
        access_token=access_token,
        id=str(db_user.id),
        username=db_user.username,
        email=db_user.email,
    )

    content = content.model_dump()
    return JSONResponse(content, status_code=200)


async def get_user_by_email(repository: repositories.UserRepository, email: str):
    return await repository.find(models.User.email == email)


async def get_user(repository: repositories.UserRepository, id: str):
    return await repository.get(id)
