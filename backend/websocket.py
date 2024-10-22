from fastapi import WebSocket
from fastapi.encoders import jsonable_encoder

from api.models.user import UserInformation


class WebsocketConnectionManager:
    def __init__(self):
        self.active_connections: list[(str, WebSocket)] = []

    async def subscribe(
        self,
        user_id: str,
        websocket: WebSocket,
    ):
        print(websocket.url.path, "pathhhhh")

        await websocket.accept()
        self.active_connections.append((user_id, websocket))

    def disconnect(self, user_id: str, websocket: WebSocket):
        self.active_connections.remove((user_id, websocket))
        # tru this connections = [conn for conn in connections if conn[1] != target_websocket]

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            print(connection)
            await connection[1].send_text(message)

    async def notify_event_participation(
        self, user: UserInformation, event_id, type: str
    ):
        for connection in self.active_connections:
            if connection[1] == user.id:
                continue
            if (connection[1].path == "/ws/") or (
                connection[1].path == ("/ws/" + event_id)
            ):
                user.type = type
                self.send_personal_message(jsonable_encoder(user))


websocket_connection_manager = WebsocketConnectionManager()


# def get_url_path(url: str):
#     return "/" + "/".join(url.split("?")[0].split("/")[3:])
