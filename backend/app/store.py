import random
import string
import time

ROOMS = {}


def generate_code():
    return "".join(random.choices(string.digits, k=6))


def new_room(host_id):
    now = time.time()
    return {
        "host_id": str(host_id),
        "name": "Frequency",
        "last_accessed": now,
        "start_time": now,
        "queue": [],
        "now_playing": None,
    }
