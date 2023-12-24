import time
from fastapi import FastAPI, Body, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signAndGetJWT, decodeJWT

#################################################

from decouple import config
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

#################################################

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/signin", tags=["Authentication"])
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

@app.post("/auth/test-token", tags=["Authentication"])
async def test(request: Request):
    request_json = await request.json()
    token = request_json.get('token')
    return decodeJWT(token)