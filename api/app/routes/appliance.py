from cv2 import add
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

appliance_router = APIRouter()

@appliance_router.get("/appliances", tags=["appliance"])
async def get_appliance():

    try:
        cursor.execute("SELECT `appliance`, `name` FROM `appliance`")
        allAppliances = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "message": "Error getting appliance"
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

@appliance_router.post("/add-appliance", tags=["appliance"])
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