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

cursor = connection.cursor() # type: ignore
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
    request_json = await request.json()
    room_number = request_json["room_number"] #type: ignore
    room_type = request_json["room_type"] #type: ignore

    query = f"SELECT COUNT(*) FROM `room` WHERE `room_number` = '{room_number}'"
    cursor.execute(query)
    room_exists = cursor.fetchone()
    if room_exists[0] != 0: # type: ignore
        return {
            "status": False,
            "msg": "Room already exists"
        }

    query = f"INSERT INTO `room` (`room_number`, `type_id`) VALUES ('{room_number}', '{room_type}')"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Room added successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to add room"
        }
    
@rooms_router.get("/all-rooms", tags=["Rooms"])
async def get_all_rooms(request: Request):
    query = "SELECT * FROM `room` NATURAL JOIN `roomtype`"
    
    try:
        cursor.execute(query)
    except:
        return {
            "status": False,
            "msg": "Unable to get rooms"
        }

    rooms = cursor.fetchall()

    return {
        "data": rooms,
        "status": True,
        "msg": "Get all rooms successful"
    }

#testing commit