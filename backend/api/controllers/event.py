import uuid

from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException

from database import repositories, models as db_models
import api.models.event as event_models

from api.models.user import UserInformation


async def create_event(
    repository: repositories.EventRepository,
    data: event_models.EventCreationPayload,
    orginizer_id: str,
):

    event = await repository.create({**data.model_dump(), "organizer": orginizer_id})

    event.id = str(event.id)
    event.organizer = str(event.organizer)

    content = event_models.Event(**vars(event))
    content = jsonable_encoder(content.model_dump())

    return JSONResponse(content, status_code=201)


async def get_event(
    repository: repositories.EventRepository,
    event_id: uuid.UUID,
):
    event = await repository.get(event_id)
    if event:
        return JSONResponse(content=jsonable_encoder(event), status_code=200)

    return JSONResponse(content="", status_code=404)


async def delete_event(
    repository: repositories.EventRepository,
    event_id: uuid.UUID,
    user_id: uuid.UUID,
):
    event = await repository.get(event_id)
    user = await repository.session.get(db_models.User, user_id)
    if str(event.organizer) != user_id:
        raise HTTPException(400)

    response = await repository.remove(event_id)
    await repository.session.commit()
    return JSONResponse(content="deleted", status_code=200)


async def find_all_active_events(repository: repositories.EventRepository):
    events = await repository.findMany()
    return JSONResponse(content=jsonable_encoder(events), status_code=200)


async def join_event(
    repository: repositories.EventRepository,
    event_id: uuid.UUID,
    user_id: str,
):
    event = await repository.get(event_id)
    user = await repository.session.get(db_models.User, user_id)

    # if event.organizer == user:
    #     raise HTTPException(400)

    for joiner in event.joiners:
        if joiner == user:
            raise HTTPException(400)

    event.joiners.append(user)
    repository.session.commit()

    return JSONResponse(content="joined event", status_code=200)


async def cancel_join_event(
    repository: repositories.EventRepository,
    event_id: uuid.UUID,
    user_id: str,
):
    event = await repository.get(event_id)
    user = await repository.session.get(db_models.User, user_id)

    if user not in event.joiners:
        raise HTTPException(400)

    event.joiners.remove(user)
    repository.session.commit()

    return JSONResponse(content="canceled", status_code=200)
