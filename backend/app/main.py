import asyncio
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, room, music
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


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth")
app.include_router(room.router, prefix="/rooms")
app.include_router(music.router, prefix="/music")
