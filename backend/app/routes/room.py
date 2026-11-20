import time
from fastapi import APIRouter, Depends, HTTPException
from app.routes.auth import get_current_user
from app.store import ROOMS, generate_code, new_room

router = APIRouter()


@router.post("/")
async def create_room(current_user=Depends(get_current_user)):
    code = generate_code()
    while code in ROOMS:
        code = generate_code()
    ROOMS[code] = new_room(current_user.id)
    return {"code": code, "room": ROOMS[code]}


@router.get("/{code}")
async def get_room(code: str):
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"code": code, "room": ROOMS[code]}


@router.get("/{code}/state")
async def get_room_state(code: str):
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")

    room = ROOMS[code]
    room["last_accessed"] = time.time()

    # Lazy evaluation: advance now_playing through the queue as time passes
    while room["now_playing"] is not None and room["queue"]:
        elapsed = time.time() - room["start_time"]
        duration = room["now_playing"].get("duration", 0)
        if elapsed >= duration:
            room["now_playing"] = room["queue"].pop(0) if room["queue"] else None
            if room["now_playing"] is not None:
                room["start_time"] = time.time()
        else:
            break

    if room["now_playing"] is None and room["queue"]:
        room["now_playing"] = room["queue"].pop(0)
        room["start_time"] = time.time()

    elapsed = time.time() - room["start_time"] if room["now_playing"] else 0

    return {
        "now_playing": room["now_playing"],
        "elapsed_seconds": elapsed,
        "queue": room["queue"],
    }


@router.post("/{code}/queue")
async def add_to_queue(code: str, track: dict, current_user=Depends(get_current_user)):
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")

    room = ROOMS[code]
    room["last_accessed"] = time.time()
    room["queue"].append(track)

    if room["now_playing"] is None:
        room["now_playing"] = room["queue"].pop(0)
        room["start_time"] = time.time()

    return {"now_playing": room["now_playing"], "queue": room["queue"]}
