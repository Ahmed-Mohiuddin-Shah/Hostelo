import re
from uu import Error
from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore

rooms_router = APIRouter()

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
    query = f"SELECT COUNT(*) FROM `student` WHERE `student_id`  NOT IN (SELECT `student_id` FROM `deletedstudent`)"
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
    query = "SELECT `room_number`, `type_name` FROM `room` NATURAL JOIN `roomtype` ORDER BY `room_number` ASC"
    
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

@rooms_router.get("/rooms/{room_number}", tags=["Rooms"])
async def get_room(request: Request, room_number: int):
    query = f"SELECT `room_number`, `type_name` FROM `room` NATURAL JOIN `roomtype` WHERE `room_number` = '{room_number}'"
    
    try:
        cursor.execute(query)
    except:
        return {
            "status": False,
            "msg": "Unable to get room"
        }

    room = cursor.fetchone()

    return {
        "data": room,
        "status": True,
        "msg": "Get room successful"
    }

@rooms_router.delete("/delete-room/{room_number}", tags=["Rooms"])
async def delete_room(room_number):

    checkOccupied = f"SELECT COUNT(*) FROM `student` WHERE `room_number` = '{room_number}' AND `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`)"

    try:
        cursor.execute(checkOccupied)
        roomOccupied = cursor.fetchone()
        if roomOccupied[0] != 0: # type: ignore
            return {
                "status": False,
                "msg": "Room is occupied"
            }
    except Error as e:
        return {
            "status": False,
            "msg": "Unable to delete room"
        }

    query = f"SELECT COUNT(*) FROM `room` WHERE `room_number` = '{room_number}'"
    cursor.execute(query)
    room_exists = cursor.fetchone()
    if room_exists[0] == 0: # type: ignore
        return {
            "status": False,
            "msg": "Room does not exist"
        }

    query = f"DELETE FROM `room` WHERE `room_number` = '{room_number}'"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Room deleted successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to delete room"
        }
    
@rooms_router.post("/edit-room/{room_number}", tags=["Rooms"])
async def update_room(room_number, request: Request):

    # edit room will not edit rooms that are occupied by at least one student

    request_json = await request.json()
    new_room_type = request_json["room_type"] #type: ignore

    query = f"SELECT COUNT(*) FROM `room` WHERE `room_number` = '{room_number}' AND `room_number` NOT IN (SELECT `room_number` FROM `student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`))"
    cursor.execute(query)
    room_exists = cursor.fetchone()
    if room_exists[0] == 0: # type: ignore
        return {
            "status": False,
            "msg": "Room does not exist"
        }

    query = f"UPDATE `room` SET `type_id` = '{new_room_type}' WHERE `room_number` = '{room_number}'"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Room updated successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to update room"
        }
    
@rooms_router.get("/all-free-rooms", tags=["Rooms"])
async def get_all_free_rooms(request: Request):
    query1 = "SELECT `room_number` FROM `room` WHERE `room_number` NOT IN ( SELECT `room_number` FROM `student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`) )"
    query2 = "SELECT `room_number`, `type_id`, ( `slots` - COUNT(DISTINCT `room_number`) ) AS 'availableSlots' FROM `student` JOIN `room` USING (`room_number`) JOIN `roomtype` USING (`type_id`) WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`) GROUP BY `room_number` HAVING 'availableSlots' > 0"
    
    try:
        rooms_with_free_slots = []
        cursor.execute(query1)
        result1 = cursor.fetchall();
        for i in result1:
            rooms_with_free_slots.append(i[0])
        cursor.execute(query2)
        result2 = cursor.fetchall();
        for i in result2:
            rooms_with_free_slots.append(i[0])
        rooms_with_free_slots.sort()
    except:
        return {
            "status": False,
            "msg": "Unable to get rooms"
        }

    return {
        "data": rooms_with_free_slots,
        "status": True,
        "msg": "Get all free rooms successful"
    }