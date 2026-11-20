import time
import socketio
from app.store import ROOMS

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

# Flat sid -> room_code tracking
SID_ROOMS = {}


@sio.event
async def connect(sid, environ, auth):
    print(f"Socket connected: {sid}")


@sio.event
async def disconnect(sid):
    code = SID_ROOMS.pop(sid, None)
    if code and code in ROOMS:
        room = ROOMS[code]
        if not any(v == code for v in SID_ROOMS.values()):
            # Room is empty, let the cleanup loop handle it
            pass
    print(f"Socket disconnected: {sid}")


@sio.event
async def join_room(sid, data):
    code = data.get("code")
    user_id = data.get("user_id")
    await sio.enter_room(sid, code)
    SID_ROOMS[sid] = code
    if code in ROOMS:
        ROOMS[code]["last_accessed"] = time.time()
    await sio.emit("joined", {"code": code, "user_id": user_id}, room=code)


@sio.event
async def chat_message(sid, data):
    code = SID_ROOMS.get(sid)
    if not code:
        return
    await sio.emit("chat_message", data, room=code)


@sio.event
async def sync_playback(sid, data):
    code = SID_ROOMS.get(sid)
    if not code or code not in ROOMS:
        return
    room = ROOMS[code]
    # Only host can control playback
    if data.get("user_id") != room.get("host_id"):
        return
    room["playback"] = data
    room["start_time"] = time.time()
    await sio.emit("playback_synced", data, room=code)


@sio.event
async def sync_queue(sid, data):
    code = SID_ROOMS.get(sid)
    if not code or code not in ROOMS:
        return
    room = ROOMS[code]
    # Only host can update queue
    if data.get("user_id") != room.get("host_id"):
        return
    room["queue"] = data.get("queue", room.get("queue", []))
    room["now_playing"] = data.get("now_playing", room.get("now_playing"))
    room["start_time"] = time.time()
    await sio.emit("queue_synced", {"queue": room["queue"], "now_playing": room["now_playing"]}, room=code)
