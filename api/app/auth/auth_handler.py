import time
from typing import Dict

import jwt
from decouple import config


JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def signAndGetJWT(data: Dict) -> Dict[str, str]:
    payload = {
        **data,
        "expires": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        status = time.time() - decoded_token["expires"] <= 0
        return {"status" : status}
    except jwt.DecodeError:
        return {
            "error": "Invalid token"
        }
