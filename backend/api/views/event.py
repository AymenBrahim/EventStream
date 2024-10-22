from fastapi import APIRouter, status

import api.models.event as event_models
from database import models as models
import api.controllers.event as event_controller
from api.dependencies import LoggedInUser, EventRepository

router = APIRouter(prefix="/event", tags=["event"])


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_event(
    data: event_models.EventCreationPayload,
    event_repository: EventRepository,
    user: LoggedInUser,
):

    return await event_controller.create_event(event_repository, data, user.id)


@router.get("/{event_id}", status_code=status.HTTP_200_OK)
async def get_event(
    event_repository: EventRepository,
    event_id: str,
    user: LoggedInUser,
):

    return await event_controller.get_event(event_repository, event_id)


@router.delete("/{event_id}", status_code=status.HTTP_200_OK)
async def remove_event(
    event_repository: EventRepository,
    event_id: str,
    user: LoggedInUser,
):

    return await event_controller.delete_event(event_repository, event_id, user.id)


@router.post("/{event_id}/join", status_code=status.HTTP_201_CREATED)
async def join_event(
    event_repository: EventRepository,
    event_id: str,
    user: LoggedInUser,
):
    return await event_controller.join_event(event_repository, event_id, user.id)


@router.post("/{event_id}/cancel", status_code=status.HTTP_201_CREATED)
async def camcel_join_event(
    event_repository: EventRepository,
    event_id: str,
    user: LoggedInUser,
):
    return await event_controller.cancel_join_event(event_repository, event_id, user.id)


@router.get("/", status_code=status.HTTP_200_OK)
async def get_events(
    event_repository: EventRepository,
    user: LoggedInUser,
):

    return await event_controller.find_all_active_events(event_repository)
