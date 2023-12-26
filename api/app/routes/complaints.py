from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore

complaints_router = APIRouter()

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

@complaints_router.get("/number-of-active-complaints", tags=["Complaints"])
async def get_active_complaints_count(request: Request):
    cursor.execute(f"SELECT COUNT(`complaint_id`) FROM `complaintandquery` WHERE EXISTS(SELECT `student_id` FROM `student` JOIN `complaintandquery` USING (`student_id`) WHERE `status`= 'pending')")
    result = cursor.fetchall()

    if result:
         return{
                "status": True,
                "msg": "Retrieval successful",
                "data": {
                    "count": result
                }
        }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
        }

@complaints_router.get("/recent-complaints", tags=["Complaints"])
async def get_recent_complaints(request: Request):
    cursor.execute(f"SELECT `name`,`description` FROM `student`,`complaintandquery` WHERE EXISTS( SELECT `student_id` FROM `student` JOIN `complaintandquery` USING (`student_id`))")
    recent_complaints = cursor.fetchall() 
           
    if len(recent_complaints) <= 2: 
        return {
                  "status": True,
                  "msg": "Retrieval successful",
                  "data": {
                    "recent_complaints": recent_complaints 
                }
               }
    else:
        result = recent_complaints[-2:]
    if result:
        return{
                  "status": True,
                  "msg": "Retrieval successful",
                  "data": {
                    "recent_complaints": result
                   }
                }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
            } 