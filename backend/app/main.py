import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, room, music
from app.api.socket import sio

app = FastAPI()

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

socket_app = socketio.ASGIApp(sio, app)
