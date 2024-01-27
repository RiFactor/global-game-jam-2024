from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

import logging

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)
logger.setLevel(logging.DEBUG)
logger.info("Server starting...")



class UserData:
    def __init__(self, manager: "ConnectionManager", socket: WebSocket) -> None:
        self.manager = manager
        self.identity = hash(socket)
        self.socket = socket
        self.name = ""
        self.score = 0

    async def receive(self) -> str:
        return await self.socket.receive_text()

    async def send_message(self, message: str):

        logger.debug("Sending message to %s (%s)", self.identity, self.name)

        await self.socket.send_text(message)

    async def send_broadcast(self, message: str):
        """Broadcast to all other users"""

        logger.debug("Broadcasting to all from %s (%s)", self.identity, self.name)

        for _id, user in self.manager.usermap.items():
            if _id == self.identity:
                continue
            await user.socket.send_text(message)


class ConnectionManager:
    def __init__(self):
        self.usermap: dict[int, UserData] = {}

    async def connect(self, websocket: WebSocket) -> UserData:
        await websocket.accept()

        data = UserData(self, websocket)
        self.usermap[data.identity] = data
        return data

    def disconnect(self, user: UserData):
        del self.usermap[user.identity]

    async def broadcast(self, message: str):
        """Broadcast to all users"""
        for _, user in self.usermap.items():
            await user.socket.send_text(message)


app = FastAPI()

# setup the manager to use throughout the application
app.state.manager = ConnectionManager()
app.mount("/", StaticFiles(directory="client/build/", html=True), name="static")


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket):
    manager: ConnectionManager = websocket.app.state.manager

    user = await manager.connect(websocket)
    logger.debug("New connection: %s", user.identity)

    try:
        while True:
            data = await user.receive()
            await user.send_message(f"You sent: {data}")
            await user.send_broadcast(f"{user.identity} sends: {data}")
    except WebSocketDisconnect:
        manager.disconnect(user)
        # await manager.broadcast(f"Client {user.identity} left the chat")
