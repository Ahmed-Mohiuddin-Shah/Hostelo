from cv2 import add
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

appliance_router = APIRouter()

@appliance_router.get("/get-appliances", tags=["Appliance"])
async def get_appliance():

    query = "SELECT `appliance_id`, `name` FROM `electricappliance`"

    try:
        cursor.execute(query)
        allAppliances = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error getting appliance"
        }
    
    result = []

    for appliance in allAppliances:
        result.append({
            "appliance_id": appliance[0],
            "appliance_name": appliance[1]
        })
    
    return {
        "status": True,
        "data": result,
        "msg": "Appliance retrieved"
    }

@appliance_router.post("/add-appliance", tags=["Appliance"], include_in_schema=False)
async def add_appliance(request: Request):
    data = await request.json()
    name = data['name']

    addApplianceQuery = f"INSERT INTO `electricappliance` (`name`) VALUES ('{name}')"

    try:
        cursor.execute(addApplianceQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "message": "Error adding appliance"
        }
    return {
        "status": True,
        "message": "Appliance added"
    }

@appliance_router.post("/add-student-appliance/", tags=["Appliance"])
async def add_student_appliance(request: Request):
    data = await request.json()

    checkStudentAppliance = f"SELECT COUNT(*) FROM `hasappliance` WHERE `student_id` = {data['student_id']} AND `appliance_id` = {data['appliance_id']}"

    try:
        cursor.execute(checkStudentAppliance)
        count = cursor.fetchone()[0]  # type: ignore
        if count > 0: #type: ignore
            return {
                "status": False,
                "msg": "Student appliance already exists"
            }
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error checking student appliance"
        }

    addStudentAppliance = f"INSERT INTO `hasappliance` (`student_id`, `appliance_id`) VALUES ({data['student_id']}, {data['appliance_id']})"

    try:
        cursor.execute(addStudentAppliance)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error adding student appliance"
        }
    return {
        "status": True,
        "msg": "Student appliance added"
    }

@appliance_router.get("/all-appliances", tags=["Appliance"])
async def all_appliances():
    allStudentsAppliancesQuery = "SELECT `student_id`, `name`, `room_number`, `appliance_id` FROM `hasappliance` NATURAL JOIN `student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`)"
    applianceQuery = "SELECT `appliance_id`, `name` FROM `electricappliance`"

    try:
        cursor.execute(applianceQuery)
        allAppliances = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error getting appliance"
        }
    
    appliances = {}

    for appliance in allAppliances:
        appliances[appliance[0]] = appliance[1]

    try:
        cursor.execute(allStudentsAppliancesQuery)
        allAppliances = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error getting appliance"
        }
    
    result = []

    for appliance in allAppliances:
        result.append({
            "student_id": appliance[0],
            "student_name": appliance[1],
            "room_number": appliance[2],
            "appliance_id": appliance[3],
            "appliance_name": appliances[appliance[3]]
        })
    
    return {
        "status": True,
        "data": result,
        "msg": "Appliance retrieved"
    }

@appliance_router.delete("/delete-student-appliance/{appliance_id}/{student_id}", tags=["Appliance"])
async def delete_student_appliance(appliance_id: int, student_id: int):
    deleteStudentApplianceQuery = f"DELETE FROM `hasappliance` WHERE `appliance_id` = {appliance_id} AND `student_id` = {student_id}"

    try:
        cursor.execute(deleteStudentApplianceQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error deleting student appliance"
        }
    return {
        "status": True,
        "msg": "Student appliance deleted"
    }