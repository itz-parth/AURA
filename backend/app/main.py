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
class CORSMiddlewareWrapper:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            async def send_with_cors(message):
                if message["type"] == "http.response.start":
                    headers = dict(message.get("headers", []))
                    headers[b"access-control-allow-origin"] = b"*"
                    headers[b"access-control-allow-methods"] = b"GET, POST, PUT, DELETE, OPTIONS"
                    headers[b"access-control-allow-headers"] = b"Content-Type, Authorization"
                    headers[b"access-control-allow-credentials"] = b"true"
                    message["headers"] = list(headers.items())
                await send(message)

            if scope["method"] == "OPTIONS":
                await send({
                    "type": "http.response.start",
                    "status": 204,
                    "headers": [
                        (b"access-control-allow-origin", b"*"),
                        (b"access-control-allow-methods", b"GET, POST, PUT, DELETE, OPTIONS"),
                        (b"access-control-allow-headers", b"Content-Type, Authorization"),
                        (b"access-control-allow-credentials", b"true"),
                        (b"content-length", b"0"),
                    ],
                })
                await send({"type": "http.response.body", "body": b"", "more_body": False})
                return

            await self.app(scope, receive, send_with_cors)
        else:
            await self.app(scope, receive, send)

app = CORSMiddlewareWrapper(socketio.ASGIApp(sio, fastapi_app))
