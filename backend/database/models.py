import uuid
import datetime

from sqlalchemy import (
    ForeignKey,
    orm,
    DateTime,
    Enum,
    PrimaryKeyConstraint,
)
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID


class TemporalBase(orm.DeclarativeBase):

    created_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )


class Base(TemporalBase):

    __abstract__ = True

    id: orm.Mapped[uuid.UUID] = orm.mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )


class Participation(TemporalBase):
    __tablename__ = "participation"
    __table_args__ = (PrimaryKeyConstraint("user_id", "event_id"),)

    user_id: orm.Mapped[str] = orm.mapped_column(ForeignKey("user.id"))
    event_id: orm.Mapped[str] = orm.mapped_column(ForeignKey("event.id"))

    status: orm.Mapped[str] = orm.mapped_column(default="active")


class User(Base):
    __tablename__ = "user"

    username: orm.Mapped[str] = orm.mapped_column(nullable=False, unique=True)
    email: orm.Mapped[str] = orm.mapped_column(nullable=False, unique=True)
    password: orm.Mapped[str] = orm.mapped_column(nullable=False)
    # participations: orm.Mapped[list["User"]] = orm.relationship(
    #     secondary="participation",
    #     backref="joiners",
    #     lazy="selectin",
    # )
    # events: orm.Mapped[list["Event"]] = orm


class Event(Base):

    __tablename__ = "event"

    title: orm.Mapped[str]
    organizer: orm.Mapped["User"] = orm.mapped_column(ForeignKey("user.id"))
    location: orm.Mapped[str]
    starts_at: orm.Mapped[datetime.datetime] = orm.mapped_column(
        DateTime(timezone=True)
    )

    duration: orm.Mapped[int]
    joiners: orm.Mapped[list["User"]] = orm.relationship(
        secondary="participation",
        backref="participations",
        lazy="selectin",
    )
