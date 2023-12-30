from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

appliance_router = APIRouter()

@appliance_router.get("/get-student-ids")
async def get_student_ids():
    try:
        cursor.execute("SELECT student_id, name FROM student")
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "message": "Error getting student ids"
        }
    return {
        "status": True,
        "data": result,
        "msg": "Student ids retrieved"
    }

@appliance_router.get("/appliances")
async def get_appliance():

    try:
        cursor.execute("SELECT * FROM appliance")
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "message": "Error getting appliance"
        }
    return {
        "status": True,
        "data": result,
        "msg": "Appliance retrieved"
    }