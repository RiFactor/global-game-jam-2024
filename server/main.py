from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

import logging

import asyncio

from server.parse_prompts import parse_prompts
from server.connections import ConnectionManager

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)
logger.setLevel(logging.DEBUG)
logger.info("Server starting...")

PROMPTS = parse_prompts("./assets/prompts.csv")

app = FastAPI()
# setup the manager to use throughout the application
app.state.manager = ConnectionManager(PROMPTS)


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    manager: ConnectionManager = websocket.app.state.manager

    user = await manager.connect(websocket, client_id)
    logger.debug("New connection: %s", user.identity)

    if manager.ready():
        loop = asyncio.get_event_loop()
        _ = loop.create_task(manager.start())

    try:
        while True:
            await user.comm_loop()
    except WebSocketDisconnect:
        logger.info("%s disconnected", user.identity)
        manager.disconnect(user)


app.mount("/", StaticFiles(directory="client/build/", html=True), name="static")
