from fastapi import APIRouter, Query
from ytmusicapi import YTMusic

ytmusic = YTMusic()

router = APIRouter()


@router.get("/search")
async def search_music(q: str = Query(..., min_length=1)):
    results = ytmusic.search(q, filter="songs", limit=10)
    tracks = []
    for item in results:
        tracks.append({
            "videoId": item.get("videoId"),
            "title": item.get("title"),
            "artist": item.get("artists", [{}])[0].get("name") if item.get("artists") else "",
            "duration": item.get("duration"),
            "thumbnail": item.get("thumbnails", [{}])[-1].get("url") if item.get("thumbnails") else "",
        })
    return tracks
