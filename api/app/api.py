from fastapi import FastAPI, Body, Depends, Request
from fastapi.middleware.cors import CORSMiddleware

from app.model import UserSchema, UserLoginSchema
from app.auth.auth_bearer import JWTBearer
from app.auth.auth_handler import signJWT, decodeJWT



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
async def sign_in(request: Request):  # Add the "username" parameter
    request_json = await request.json()
    query = f"SELECT * FROM `user` WHERE `username`='{request_json.get('username')}' AND `password`='{request_json.get('password')}'"
    cursor.execute(query)

    users = cursor.fetchall()

    if len(users) > 0:
        if len(users) > 1:
            return {"msg": "More than one user with the same username and password"}
        else:
            return signJWT(str(users[0][0]))  # Convert the argument to a string
    
    return {"msg": "Username incorrect/does not exist OR password is incorrect"}

@app.post("/auth/test", tags=["Authentication"])
async def test(request: Request):
    request_json = await request.json()
    token = request_json.get('token')
    return decodeJWT(token)