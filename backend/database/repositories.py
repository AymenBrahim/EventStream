import uuid
from typing import Generic, TypeVar


import sqlalchemy
from sqlalchemy import BinaryExpression
from sqlalchemy.ext.asyncio import AsyncSession


from database import models


Model = TypeVar("Model", bound=models.Base)


class DatabaseRepository(Generic[Model]):
    """Repository for performing database queries."""

    def __init__(self, model: type[Model], session: AsyncSession) -> None:
        self.model = model
        self.session = session

    async def create(self, data: dict) -> Model:
        instance = self.model(**data)
        self.session.add(instance)
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def get(self, id: uuid.UUID) -> Model | None:
        return await self.session.get(self.model, id)

    async def remove(self, id: uuid.UUID) -> Model | None:
        stmt = sqlalchemy.delete(self.model).where(self.model.id == id)
        await self.session.execute(stmt)

    async def find(
        self,
        *expressions: BinaryExpression,
    ) -> Model | None:
        query = sqlalchemy.select(self.model)
        if expressions:
            query = query.where(*expressions).limit(1)
        return await self.session.scalar(query)

    async def findMany(
        self,
        *expressions: BinaryExpression,
    ) -> list[Model]:
        query = sqlalchemy.select(self.model)
        if expressions:
            query = query.where(*expressions)
        return list(await self.session.scalars(query))


UserRepository = DatabaseRepository[models.User]
EventRepository = DatabaseRepository[models.Event]
