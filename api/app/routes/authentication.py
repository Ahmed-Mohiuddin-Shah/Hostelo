from fastapi import APIRouter, Body, Depends, Request
from app.auth.auth_handler import signAndGetJWT, decodeJWT
from app.my_sql_connection_cursor import cursor, connection # type: ignore
from app.auth.security import check_encrypted_password
from decouple import config

import bcrypt

auth_router = APIRouter()

@auth_router.post("/signin", tags=["Authentication"])
async def sign_in(request: Request):
    request_json = await request.json()

    username = request_json.get('username')
    password = request_json.get('password')

    query = f"SELECT * FROM `user` WHERE `username`='{username}'"
    
    cursor.execute(query)

    user = cursor.fetchone()
    if user is None:
        return {
            "status": False,
            "msg": "Username not found"
        }
    
    username, hashed_password, role, image_url = user

    recieved_hashed_password = bcrypt.hashpw(password.encode('utf-8'), config('SALT').encode('utf-8')).decode('utf-8')

    if check_encrypted_password(recieved_hashed_password, hashed_password) is False: #type: ignore  
        return {
            "status": False,
            "msg": "Incorrect password"
        }

    if role == "admin":
        name = "admin"
    elif role == "worker":
        query = f"SELECT `name` FROM `staff` WHERE `email`='{username}'"
    elif role == "manager":
        query = f"SELECT `name` FROM `staff` WHERE `email`='{username}'"
    else:
        query = f"SELECT `name` FROM `student` WHERE `email`='{username}'"
        
    try:
        cursor.execute(query)
        name = cursor.fetchone()[0] #type: ignore
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Something went wrong"
        }
    
    if name is None:
        return {
            "status": False,
            "msg": "Something went wrong"
        }
    
    token = signAndGetJWT({"username": username, "role": role, "name": name, "image_url": image_url})
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