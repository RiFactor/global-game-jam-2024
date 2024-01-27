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

    @staticmethod
    def team_assign(uid: int, team: int) -> "Event":
        return Event("teamAssign", dict(userid=uid, team=team))

    def to_json(self) -> str:
        event = dict(eventType=self.eventType, data=self.data)
        return json.dumps(event)


# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)


class UserConnection:
    def __init__(self, manager: "ConnectionManager", socket: WebSocket, client_id: int) -> None:
        self.manager = manager
        self.client_id = client_id
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
        self.team = {1: [], 2:[]}

    async def connect(self, websocket: WebSocket, client_id: int) -> UserConnection:
        await websocket.accept()
        user = UserConnection(self, websocket, client_id)
        self.usermap[user.identity] = user

        await self._assign_team(user)
        return user

    async def _assign_team(self, user: UserConnection) -> None:
        for i in range(1, 3):
            if len(self.team[i]) < 2:
                self.team[i].append(user.identity)
                await user.send_message(Event.team_assign(user.identity, i).to_json())
                logger.info("Assigned %s to team %s", user.identity, i)
                return
        else:
            logger.error("Too many users")

    def disconnect(self, user: UserConnection) -> None:
        for _, players in self.team.items():
            if user.identity in players:
                players.remove(user.identity)
                break
        else:
            logger.warn("User %s was not in any team", user.identity)

        del self.usermap[user.identity]

    async def broadcast(self, message: str) -> None:
        """Broadcast to all users"""
        for _, user in self.usermap.items():
            await user.socket.send_text(message)
