from fastapi import FastAPI, Body, Depends

from app.model import UserSchema, UserLoginSchema
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT

app = FastAPI()


# helpers

def check_user(data: UserLoginSchema):
    for user in users:
        if user.username == data.username and user.password == data.password:
            return True
    return False


# route handlers

@app.get("/auth/signin", tags=["sign-in"])
def sign_in():
    return {"message": "F U Hamza"}
