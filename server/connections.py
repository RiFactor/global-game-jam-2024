from typing import Any, Tuple
from fastapi import WebSocket, WebSocketDisconnect

import logging
import json

from dataclasses import dataclass

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)

KEY_PRESSED = "keyPress"
TEAM_ASSIGN = "teamAssign"
KEY_BUFFER = "keyBuffer"


@dataclass
class Event:
    eventType: str
    data: dict

    @staticmethod
    def from_json(text: str) -> "Event":
        data = json.loads(text)
        return Event(data["eventType"], data["data"])

    @staticmethod
    def team_assign(uid: int, team: int, playernum) -> "Event":
        return Event(TEAM_ASSIGN, dict(userid=uid, team=team, playernum=playernum))

    @staticmethod
    def key_buffer(team: int, keys: list[dict]) -> "Event":
        return Event(KEY_BUFFER, dict(team=team, keys=keys))

    def to_json(self) -> str:
        event = dict(eventType=self.eventType, data=self.data)
        return json.dumps(event)


class UserConnection:
    def __init__(
        self,
        manager: "ConnectionManager",
        socket: WebSocket,
        client_id: int,
        team: int,
        playernum: int,
    ) -> None:
        self.manager = manager
        self.client_id = client_id
        self.identity = hash(socket)
        self.socket = socket
        self.team = team
        self.playernum = playernum

    async def receive_event(self) -> Event:
        text = await self.socket.receive_text()
        return Event.from_json(text)

    async def broadcast(self, event: Event) -> None:
        await self.send_broadcast(event.to_json())

    async def send_message(self, message: str) -> None:
        logger.debug("Sending message to %s", self.identity)
        await self.socket.send_text(message)

    async def send_broadcast(self, message: str) -> None:
        """Broadcast to all other users"""
        logger.debug("Broadcasting to all from %s", self.identity)
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

        if event.eventType == KEY_PRESSED:
            # add the event to the buffer, then broadcast to all
            self.manager.buffers[self.team].append(event.data)
            await self.manager.broadcast_buffer(self.team)
        else:
            logger.error("Unknown event %s", event.eventType)
            raise Exception("Unknown event type")


class ConnectionManager:
    def __init__(self, prompts: list[tuple[str, list[str]]]):
        self.usermap: dict[int, UserConnection] = {}
        self.team = {1: [], 2: []}
        self.buffers: dict[int, list[dict]] = {1: [], 2:[]}
        self.prompts = prompts

    def ready(self) -> bool:
        return len(self.usermap) == 4

    async def start(self) -> None:
        logger.info("Starting game")

    async def connect(self, websocket: WebSocket, client_id: int) -> UserConnection:
        await websocket.accept()
        # wrap new user connection
        user = self._new_user(websocket, client_id)
        await user.send_message(
            Event.team_assign(user.identity, user.team, user.playernum).to_json()
        )

        # assign to the list of users
        self.usermap[user.identity] = user
        return user

    def _new_user(self, websocket: WebSocket, client_id: int) -> UserConnection:
        # find what team / playernum they should be
        team, playernum = self._assign_team()
        user = UserConnection(self, websocket, client_id, team, playernum)
        self.team[team].append(user.identity)
        logger.info(
            "Assigned %s to team %s as player %s", user.identity, team, playernum
        )
        return user

    def _assign_team(self) -> Tuple[int, int]:
        # search through all teams for where there's space
        for i in range(1, 3):
            if len(self.team[i]) < 2:
                playernum = len(self.team[i]) + 1
                return (i, playernum)
        else:
            logger.error("Too many users")
            raise Exception("Too many players")

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

    async def broadcast_buffer(self, team: int) -> None:
        logger.debug("Broadcasting buffer of team %s", team)
        await self.broadcast(Event.key_buffer(team, self.buffers[team]).to_json())


