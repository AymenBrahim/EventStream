from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from api.views.public import router as public_router
from api.views.user import router as user_router
from api.views.event import router as event_router

from websocket import websocket_connection_manager

from api.dependencies import WsLoggedIn
from config import server_settings

app = FastAPI(
    title=server_settings.project_name,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
)


@app.get("/")
async def ping(request: Request):
    # Your code for handling '/images' requests goes here
    return {"hellooo": "world!"}


@app.get("/api")
async def ping(request: Request):
    # Your code for handling '/images' requests goes here
    return {"hellooo": "world!"}


@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    user: WsLoggedIn,
):

    await websocket_connection_manager.subscribe(str(user.id), websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket_connection_manager.broadcast(data)
            # print(user)
            # print(websocket.url)
            # print(data)
            # await websocket.send_text(f"Message text was: {data}")
    except WebSocketDisconnect:
        websocket_connection_manager.disconnect(str(user.id), websocket)
        await websocket_connection_manager.broadcast(
            f"Client #{user.username} left the chat"
        )


# @app.websocket("/ws/{client_id}")
# async def websocket_endpoint(websocket: WebSocket, client_id: str):
#     print(client_id)
#     await websocket_connection_manager.subscribe(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await websocket_connection_manager.send_personal_message(
#                 f"You wrote: {data}", websocket
#             )
#             await websocket_connection_manager.broadcast(
#                 f"Client #{client_id} says: {data}"
#             )
#     except websocket_connection_manager:
#         websocket_connection_manager.disconnect(websocket)
#         await websocket_connection_manager.broadcast(
#             f"Client #{client_id} left the chat"
#         )


origins = [
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router, prefix="/api")
app.include_router(public_router, prefix="/api")
app.include_router(event_router, prefix="/api")

# app.add_middleware(Authorize)

# token_validation.py
# Retrieve the secret key and algorithm from environment variables


# Define a route handler for handling requests to '/images'
