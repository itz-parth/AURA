from fastapi import APIRouter, Depends, HTTPException, status
from app.api.auth import get_current_user
from app.store import ROOMS, generate_code

router = APIRouter()


@router.post("/")
async def create_room(current_user=Depends(get_current_user)):
    code = generate_code()
    while code in ROOMS:
        code = generate_code()
    ROOMS[code] = {
        "name": "Frequency",
        "host_id": str(current_user.id),
        "queue": [],
        "playback": {"videoId": None, "isPlaying": False},
    }
    return {"code": code, "room": ROOMS[code]}


@router.get("/{code}")
async def get_room(code: str):
    if code not in ROOMS:
        raise HTTPException(status_code=404, detail="Room not found")
    return {"code": code, "room": ROOMS[code]}
