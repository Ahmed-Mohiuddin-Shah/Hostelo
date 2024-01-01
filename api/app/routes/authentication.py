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

