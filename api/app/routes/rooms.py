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

@rooms_router.get("/room-types", tags=["Rooms"])
async def get_room_types(request: Request):

    query = "SELECT * FROM `roomtype`"
    cursor.execute(query)
    room_types = cursor.fetchall()

    return {
        "data": room_types,
        "status": True,
        "msg": "Get room types successful"
    }

@rooms_router.get("/number-of-free-slots", tags=["Rooms"])
async def get_total_free_slots(request: Request):
    query = f"SELECT COUNT(*) FROM `student`"
    cursor.execute(query)
    total_students = cursor.fetchone()
    query = f"SELECT COUNT(*) FROM `room` NATURAL JOIN `roomtype` WHERE `type_id` = 1"
    cursor.execute(query)
    single_rooms = cursor.fetchone()
    query = f"SELECT COUNT(*) FROM `room` NATURAL JOIN `roomtype` WHERE `type_id` = 2"
    cursor.execute(query)
    double_community = cursor.fetchone()
    query = f"SELECT COUNT(*) FROM `room` NATURAL JOIN `roomtype` WHERE `type_id` = 3"
    cursor.execute(query)
    triple_room = cursor.fetchone()
    query = f"SELECT COUNT(*) FROM `room` NATURAL JOIN `roomtype` WHERE `type_id` = 4"
    cursor.execute(query)
    double_attached = cursor.fetchone()

    available_student_slots = single_rooms[0] + (double_community[0] * 2) + (triple_room[0] * 3) + (double_attached[0] * 2) - total_students[0] # type: ignore
    if available_student_slots:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {
               "count": available_student_slots
            }
        }
    else:
       return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       } 

@rooms_router.post("/add-room", tags=["Rooms"])
async def add_room(request: Request):
    pass