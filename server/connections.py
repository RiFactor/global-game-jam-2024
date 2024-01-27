
from fastapi import  WebSocket
import logging

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)

class UserConnection:
    def __init__(self, manager: "ConnectionManager", socket: WebSocket) -> None:
        self.manager = manager
        self.identity = hash(socket)
        self.socket = socket
        self.name = ""

    async def receive(self) -> str:
        return await self.socket.receive_text()

    async def send_message(self, message: str) -> None:

        logger.debug("Sending message to %s (%s)", self.identity, self.name)

        await self.socket.send_text(message)

    async def send_broadcast(self, message: str) -> None:
        """Broadcast to all other users"""

        logger.debug("Broadcasting to all from %s (%s)", self.identity, self.name)

        for _id, user in self.manager.usermap.items():
            if _id == self.identity:
                continue
            await user.socket.send_text(message)

    async def comm_loop(self) -> None:
        """Main communications loop"""
        data = await self.receive()
        await self.send_message(f"You sent: {data}")
        await self.send_broadcast(f"{self.identity} sends: {data}")


class ConnectionManager:
    def __init__(self):
        self.usermap: dict[int, UserConnection] = {}

    async def connect(self, websocket: WebSocket) -> UserConnection:
        await websocket.accept()

        data = UserConnection(self, websocket)
        self.usermap[data.identity] = data
        return data

    def disconnect(self, user: UserConnection) -> None:
        del self.usermap[user.identity]

    async def broadcast(self, message: str) -> None:
        """Broadcast to all users"""
        for _, user in self.usermap.items():
            await user.socket.send_text(message)

