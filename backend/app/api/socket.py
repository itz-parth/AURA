import socketio
from app.store import ROOMS

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")
SID_ROOMS = {}


@sio.event
async def connect(sid, environ):
    print("socket connect:", sid)


@sio.event
async def join_room(sid, data):
    code = data["room_code"]
    await sio.enter_room(sid, code)
    SID_ROOMS[sid] = code
    print("join:", sid, "->", code)


@sio.event
async def chat_message(sid, data):
    code = SID_ROOMS.get(sid)
    if code:
        await sio.emit("chat_message", data, room=code)


@sio.event
async def sync_playback(sid, data):
    code = SID_ROOMS.get(sid)
    if not code or code not in ROOMS:
        return
    if ROOMS[code]["host_id"] != data.get("user_id"):
        return
    ROOMS[code]["playback"] = data["playback"]
    await sio.emit("playback_synced", data["playback"], room=code)


@sio.event
async def sync_queue(sid, data):
    code = SID_ROOMS.get(sid)
    if not code or code not in ROOMS:
        return
    if ROOMS[code]["host_id"] != data.get("user_id"):
        return
    ROOMS[code]["queue"] = data["queue"]
    await sio.emit("queue_synced", data["queue"], room=code)


@sio.event
async def disconnect(sid):
    code = SID_ROOMS.pop(sid, None)
    if code and code in ROOMS:
        room = ROOMS[code]
        members = [s for s, c in SID_ROOMS.items() if c == code]
        if not members:
            del ROOMS[code]
            print("room deleted:", code)
