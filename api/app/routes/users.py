from uu import Error
from fastapi import APIRouter, Body, Depends, Request
from app.auth.auth_handler import signAndGetJWT
from app.my_sql_connection_cursor import cursor, connection # type: ignore

users_router = APIRouter()

@users_router.post("/update-profile-picture", tags=["Users"])
async def update_profile_picture(request: Request):
    request_json = await request.json()
    username = request_json.get('username')
    image_url = request_json.get('image_url')
    role = request_json.get('role')
    name = request_json.get('name')

    print(username, image_url, role, name)

    query = f"UPDATE `user` SET `image_path`='{image_url}' WHERE `username`='{username}'"
    try:
        cursor.execute(query)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Something went wrong"
        }
    
    return {
        "token": signAndGetJWT({"username": username, "role": role, "name": name, "image_url": image_url}), 
        "status": True,
        "msg": "Profile picture updated successfully"
    }
    
