from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore

mess_router = APIRouter()

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

@mess_router.get("/mess-off-students", tags=["Mess"])
async def get_mess_off_students(request: Request):
    cursor.execute(f"SELECT `student_id`,`name`,`room_number`, (SELECT `end_date`-`start_date` AS `daysOFF` FROM `messoff`) from `student` WHERE EXISTS( SELECT `student_id` FROM `student` JOIN `messoff` USING (`student_id`) JOIN `room` USING (`room_number`))")
    result = cursor.fetchall()
    if result:
        return{
                "status": True,
                "msg": "Retrieval successful",
                "data": {
                    "recent complaints": result
                }
        }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
        } 