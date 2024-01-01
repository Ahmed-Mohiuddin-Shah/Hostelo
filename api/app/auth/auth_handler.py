import time
from typing import Dict

import jwt
from decouple import config # type: ignore


JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def signAndGetJWT(data: Dict) -> str:
    payload = {
        **data,
        "expires": time.time() + 600
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)  #type: ignore
    return token


def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])  #type: ignore
        status = time.time() - decoded_token["expires"] <= 0

        ## TODO: Uncomment this after testing

        # if status is True:
        #     return decoded_token
        # else:

        # return {"status" : status}
        return decoded_token
    except jwt.DecodeError:
        return {
            "error": "Invalid token"
        }
    
def getRole(token: str) -> str:
    decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])  #type: ignore
    return decoded_token["role"]

def getUsername(token: str) -> str:
    decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])  #type: ignore
    return decoded_token["username"]