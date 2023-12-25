from fastapi import APIRouter, Body, Depends, Request
from app.auth.auth_handler import signAndGetJWT, decodeJWT

auth_router = APIRouter()

########################################################

from decouple import config # type: ignore
from mysql.connector import connect, Error

try:
    connection = connect(
        host = config("mySQLServerIP"),
        user = config("apiUserName"),
        password = config("apiPassword")
    )
except Error as e:
    print(e)

cursor = connection.cursor()
cursor.execute("USE Hostelo")

print("Connected to MySQL Server")

########################################################


@auth_router.post("/signin", tags=["Authentication"])
async def sign_in(request: Request):
    request_json = await request.json()
    query = f"SELECT * FROM `user` WHERE `username`='{request_json.get('username')}' AND `password`='{request_json.get('password')}'"
    
    cursor.execute(query)

    user = cursor.fetchone()
    if user is None:
        return {
            "status": False,
            "msg": "Username or password is incorrect"
        }
    
    username, _, role = user
    token = signAndGetJWT({"username": username, "role": role})
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

