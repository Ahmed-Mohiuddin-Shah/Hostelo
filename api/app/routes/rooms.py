from fastapi import APIRouter, Body, Depends, Request

rooms_router = APIRouter()

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

@rooms_router.get("/room-types", tags=["Students"])
async def get_room_types(request: Request):

    query = "SELECT * FROM `roomtype`"
    cursor.execute(query)
    room_types = cursor.fetchall()

    return {
        "data": room_types,
        "status": True,
        "msg": "Get room types successful"
    }