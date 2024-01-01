from uu import Error
from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore

users_router = APIRouter()

@users_router.post("/update-profile-picture", tags=["Users"])
async def update_profile_picture(request: Request):
    request_json = await request.json()
    username = request_json.get('username')
    image_url = request_json.get('image_url')
    query = f"UPDATE `user` SET `image_url`='{image_url}' WHERE `username`='{username}'"
    try:
        cursor.execute(query)
        connection.commit()
        return {
            "status": True,
            "msg": "Profile picture updated successfully"
        }
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Something went wrong"
        }