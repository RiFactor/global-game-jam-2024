from typing import Any
from fastapi import WebSocket, WebSocketDisconnect

import logging
import json

from dataclasses import dataclass


@dataclass
class Event:
    eventType: str
    data: dict

    @staticmethod
    def from_json(text: str) -> "Event":
        data = json.loads(text)
        return Event(data["eventType"], data["data"])

    def to_json(self) -> str:
        event = dict(event=self.eventType, data=self.data)
        return json.dumps(event)


# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)


class UserConnection:
    def __init__(self, manager: "ConnectionManager", socket: WebSocket) -> None:
        self.manager = manager
        self.identity = hash(socket)
        self.socket = socket
        self.name = ""

    async def receive_event(self) -> Event:
        text = await self.socket.receive_text()
        return Event.from_json(text)

    async def broadcast(self, event: Event) -> None:
        await self.send_broadcast(event.to_json())

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
        try:
            event = await self.receive_event()
        except WebSocketDisconnect as err:
            raise err
        except json.JSONDecodeError:
            logger.exception("JSON decoder error")
            return
        logger.info("%s event from %s", event.eventType, self.identity)
        await self.broadcast(event)


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
