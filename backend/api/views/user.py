from typing import Annotated, Union

from fastapi import APIRouter, Depends, HTTPException, status

import api.models.user as user_models
from database import models as models
from api.controllers.user import create_user
from api.dependencies import LoggedInUser, UserRepository

router = APIRouter(prefix="/user", tags=["user"])


# IngredientRepository = Annotated[
#     DatabaseRepository[db_models.Ingredient],
#     Depends(get_repository(db_models.Ingredient)),
# ]
# PotionRepository = Annotated[
#     DatabaseRepository[db_models.Potion],
#     Depends(get_repository(db_models.Potion)),
# ]


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(repository: UserRepository, user: LoggedInUser):
    # user = await create_user(
    #     repository,
    # )
    return user


@router.post("/signin", status_code=status.HTTP_200_OK)
async def signin(
    data: user_models.UserSignupPayload,
    repository: UserRepository,
):
    # user = await create_user(
    #     repository,
    # )s
    return {"hola": "s"}


# @router.post("/ingredients", status_code=status.HTTP_201_CREATED)
# async def create_ingredient(
#     data: models.IngredientPayload,
#     repository: IngredientRepository,
# ) -> models.Ingredient:
#     ingredient = await repository.create(data.model_dump())
#     return models.Ingredient.model_validate(ingredient)


# @router.get("/ingredients", status_code=status.HTTP_200_OK)
# async def get_ingredients(repository: IngredientRepository) -> list[models.Ingredient]:
#     ingredients = await repository.filter()
#     return [models.Ingredient.model_validate(ingredient) for ingredient in ingredients]


# @router.get("/ingredients/{pk}", status_code=status.HTTP_200_OK)
# async def get_ingredient(
#     pk: uuid.UUID,
#     repository: IngredientRepository,
# ) -> models.Ingredient:
#     ingredient = await repository.get(pk)
#     if ingredient is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Ingredient does not exist",
#         )
#     return models.Ingredient.model_validate(ingredient)


# @router.post("/potions", status_code=status.HTTP_201_CREATED)
# async def create_potion(
#     data: models.PotionPayload,
#     ingredient_repository: IngredientRepository,
#     potion_repository: PotionRepository,
# ) -> models.Potion:
#     data_dict = data.model_dump()
#     ingredients = await ingredient_repository.filter(
#         db_models.Ingredient.pk.in_(data_dict.pop("ingredients"))
#     )
#     potion = await potion_repository.create({**data_dict, "ingredients": ingredients})
#     return models.Potion.model_validate(potion)


# @router.get("/potions", status_code=status.HTTP_200_OK)
# async def get_potions(repository: PotionRepository) -> list[models.Potion]:
#     potions = await repository.filter()
#     return [models.Potion.model_validate(potion) for potion in potions]


# @router.get("/potions/{pk}", status_code=status.HTTP_200_OK)
# async def get_potion(pk: uuid.UUID, repository: PotionRepository) -> models.Potion:
#     potion = await repository.get(pk)
#     if potion is None:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Potion does not exist",
#         )
#     return models.Potion.model_validate(potion)
