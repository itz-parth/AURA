import random
import string

ROOMS = {}


def generate_code():
    return "".join(random.choices(string.digits, k=6))
