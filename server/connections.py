from typing import Any, Tuple
from fastapi import WebSocket, WebSocketDisconnect

import logging
import json
import random
import asyncio

from dataclasses import dataclass

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)

ROUND_WAIT_TIME = 5 # seconds
PROMPT_TIME_WAIT = 5 # seconds

KEY_PRESSED = "keyPress"
TEAM_ASSIGN = "teamAssignment"
KEY_BUFFER = "keyBuffer"
SETUP = "setup"
SUBMISSION = "submission"
ROUND_OVER = "roundOver"
SEND_HINT = "prompt"


@dataclass
class Event:
    eventType: str
    data: dict

    @staticmethod
    def from_json(text: str) -> "Event":
        data = json.loads(text)
        return Event(data["eventType"], data["data"])

    @staticmethod
    def send_hint(cont: bool, hint: str) -> "Event":
        return Event(SEND_HINT, dict(continued=int(cont), prompt=hint))

    @staticmethod
    def team_assign(uid: int, team: int, playernum) -> "Event":
        return Event(TEAM_ASSIGN, dict(userid=uid, team=team, playernum=playernum))

    @staticmethod
    def key_buffer(team: int, keys: list[dict]) -> "Event":
        return Event(KEY_BUFFER, dict(team=team, keys=keys))

    @staticmethod
    def setup(layout: list[int]) -> "Event":
        return Event(SETUP, dict(bufferLayout=layout))

    @staticmethod
    def round_over(team: int, word: str, score1: int, score2: int) -> "Event":
        return Event(ROUND_OVER, {"winningTeam": team, "winningWord": word, "team1score": score1, "team2score": score2})

    @staticmethod
    def submission(team: int, word: str, correct: bool) -> "Event":
        return Event(SUBMISSION, dict(team=team, submission=word, correct=int(correct)))

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

        logger.debug("%s event from %s", event.eventType, self.identity)

        if event.eventType == KEY_PRESSED:
            # is there space in the buffer
            if self.manager.current_prompt:
                key = self.manager.get_key()
                prompt_length = len(key)

                if len(self.manager.buffers[self.team]) >= prompt_length:
                    # clear the buffer
                    logger.debug("Clearing team %s buffer", self.team)
                    self.manager.buffers[self.team].clear()
                else:
                    # add the event to the buffer, then broadcast to all
                    self.manager.buffers[self.team].append(
                        dict(key=event.data["value"],  userid=self.identity)
                    )
                await self.manager.broadcast_buffer(self.team)

                # if the buffers are now the same length
                if len(self.manager.buffers[self.team]) == prompt_length:
                    word = self.manager.get_submission(self.team)
                    if word.lower() == key:
                        logger.info("Team %s is correct", self.team)
                        await self.manager.announce_winner(self.team, word)
                    else:
                        logger.info("Team %s is incorrect", self.team)
                        await self.manager.broadcast(Event.submission(self.team, word, False).to_json())
            else:
                # no further processing whilst there is no prompt
                return
        else:
            logger.error("Unknown event %s", event.eventType)
            raise Exception("Unknown event type")


class ConnectionManager:

    def __init__(self, prompts: list[tuple[str, list[str]]]):
        self.usermap: dict[int, UserConnection] = {}
        self.team = {1: [], 2: []}
        self.score = {1: 0, 2: 0}
        self._init_empty_buffers()
        self.prompts = prompts
        self.current_prompt : tuple[str, list[str]] | None = None

    def _init_empty_buffers(self) -> None:
        self.buffers: dict[int, list[dict]] = {1: [], 2: []}

    def ready(self) -> bool:
        return len(self.usermap) == 4

    async def start(self) -> None:
        logger.info("Starting round")
        # clear whatever is in the current buffers
        self._init_empty_buffers()

        self.current_prompt = random.choice(self.prompts)
        key, hints = self.current_prompt

        logger.info("Prompt is: %s", key)
        layout = [len(i) for i in key.split(" ")]

        await self.broadcast(Event.setup(layout).to_json())
        await self._recursive_send_hints(False, hints)


    async def _recursive_send_hints(self, cont: bool, hints: list[str]) -> None:
        await self.broadcast(Event.send_hint(cont, hints[0]).to_json())

        # queue up the next hint if there is one
        if len(hints) > 1:
            await asyncio.sleep(PROMPT_TIME_WAIT)
            await self._recursive_send_hints(True, hints[1:])

    def get_key(self) -> str:
        if self.current_prompt:
            key = self.current_prompt[0].replace(" ", "")
            return key.lower()
        raise Exception("No prompt")


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

    async def announce_winner(self, team: int, word: str) -> None:
        # set current prompt to none to stop listening to new keys
        self.current_prompt = None

        # send out announcements / scores
        self.score[team] += 1
        await self.broadcast(Event.submission(team, word, True).to_json())
        await self.broadcast(Event.round_over(team, word, self.score[1], self.score[2]).to_json())

        # wait a few seconds, then start next round
        await asyncio.sleep(ROUND_WAIT_TIME)
        await self.start()

    def get_submission(self, team: int) -> str:
        data = self.buffers[team]
        return "".join(i["key"] for i in data)
