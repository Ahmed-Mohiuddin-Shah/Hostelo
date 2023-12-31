from fastapi import APIRouter, Body, Depends, Request
from numpy import integer
from app.auth.auth_handler import signAndGetJWT, decodeJWT
from app.my_sql_connection_cursor import cursor, connection # type: ignore

auth_router = APIRouter()

@auth_router.post("/signin", tags=["Authentication"])
async def sign_in(request: Request):
    request_json = await request.json()
    print(request_json)
    query = f"SELECT * FROM `user` WHERE `username`='{request_json.get('username')}' AND `password`='{request_json.get('password')}'"
    
    cursor.execute(query)

    user = cursor.fetchone()
    if user is None:
        return {
            "status": False,
            "msg": "Username or password is incorrect"
        }
    
    username, _, role, image_url = user
    
    token = signAndGetJWT({"username": username, "role": role, "image_url": image_url})
    return {
        "status": True,
        "msg": "Login successful",
        "token": token
    }

@auth_router.post("/validate-token", tags=["Authentication"])
async def validate_tokem(request: Request):
    request_json = await request.json()
    token = request_json.get('token')
    return decodeJWT(token)

