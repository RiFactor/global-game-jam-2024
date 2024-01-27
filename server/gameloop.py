from server.connections import UserConnection

import logging

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)
logger.setLevel(logging.DEBUG)


class OneHandedPlayer:
    def __init__(self, userdata: UserConnection) -> None:
        self.userdata = userdata
        self.buddy: OneHandedPlayer | None = None
