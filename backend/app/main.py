import asyncio
import time
from contextlib import asynccontextmanager

import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, room, music
from app.socket.events import sio
from app.store import ROOMS


@asynccontextmanager
async def lifespan(app: FastAPI):
    async def cleanup_loop():
        while True:
            now = time.time()
            for code in list(ROOMS.keys()):
                if now - ROOMS[code]["last_accessed"] > 300:
                    del ROOMS[code]
            await asyncio.sleep(60)

    task = asyncio.create_task(cleanup_loop())
    yield
    task.cancel()


# FastAPI app for REST routes
fastapi_app = FastAPI(lifespan=lifespan)

fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fastapi_app.include_router(auth.router, prefix="/auth")
fastapi_app.include_router(room.router, prefix="/rooms")
fastapi_app.include_router(music.router, prefix="/music")

# Socket.IO ASGI app wraps the FastAPI app
app = socketio.ASGIApp(sio, fastapi_app)
