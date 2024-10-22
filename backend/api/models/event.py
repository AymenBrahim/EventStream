import uuid
from typing import List
from pydantic import BaseModel, ConfigDict, Field
import datetime


class Base(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class EventCreationPayload(Base):
    title: str = Field(min_length=1, max_length=128)
    location: str = Field(min_length=1, max_length=128)
    starts_at: datetime.datetime
    duration: int


class Event(EventCreationPayload):
    id: str
    organizer: str
    joiners: List[str] = []


class Events(BaseModel):
    events: List[Event]


# title: orm.Mapped[str]
#     organizer: orm.Mapped["User"] = orm.mapped_column(ForeignKey("event.id"))
#     location: orm.Mapped[str]
#     starts_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
#         DateTime(timezone=True)
#     )

#     duration: orm.Mapped[int]
#     joiners: orm.Mapped[list["User"]] = orm.relationship(
#         secondary="participation",
#         backref="participations",
#         lazy="selectin",
#     )
