from typing import Annotated

from fastapi import Depends, WebSocketException, status, WebSocket, Query

from collections.abc import Callable
from fastapi import Depends
from api.security import oauth2_scheme, decode_access_token
from database import models, repositories, session
from sqlalchemy.ext.asyncio import AsyncSession
from api.models.user import UserInformation


def get_repository(
    model: type[models.Base],
) -> Callable[[AsyncSession], repositories.DatabaseRepository]:
    def func(session: AsyncSession = Depends(session.get_db_session)):
        return repositories.DatabaseRepository(model, session)

    return func


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    payload = decode_access_token(token)
    return payload


LoggedInUser = Annotated[
    UserInformation,
    Depends(get_current_user),
]

UserRepository = Annotated[
    repositories.UserRepository,
    Depends(get_repository(models.User)),
]

EventRepository = Annotated[
    repositories.EventRepository,
    Depends(get_repository(models.Event)),
]


async def get_token(
    websocket: WebSocket,
    token: Annotated[str | None, Query()] = None,
):

    if token is None:
        raise WebSocketException(code=status.WS_1008_POLICY_VIOLATION)
    return token


async def get_ws_user(token: Annotated[str, Depends(get_token)]):
    return decode_access_token(token)


WsLoggedIn = Annotated[
    UserInformation,
    Depends(get_ws_user),
]
