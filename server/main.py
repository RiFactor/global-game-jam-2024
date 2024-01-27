from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

import logging

from server.connections import ConnectionManager

# prepend uvicorn so it all uses the same handler
logger = logging.getLogger("uvicorn." + __name__)
logger.setLevel(logging.DEBUG)
logger.info("Server starting...")


app = FastAPI()

# setup the manager to use throughout the application
app.state.manager = ConnectionManager()


@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    manager: ConnectionManager = websocket.app.state.manager

    user = await manager.connect(websocket)
    logger.debug("New connection: %s", user.identity)

    try:
        while True:
            await user.comm_loop()
    except WebSocketDisconnect:
        logger.info("%s disconnected", user.identity)
        manager.disconnect(user)


app.mount("/", StaticFiles(directory="client/build/", html=True), name="static")
