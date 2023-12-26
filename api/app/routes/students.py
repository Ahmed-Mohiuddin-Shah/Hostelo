from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore

students_router = APIRouter()

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

@students_router.get("/number-of-students", tags=["Student"])
async def get_total_students(request: Request):
    query  = f"SELECT COUNT(student_id) FROM `Student` "
    cursor.execute(query)

    total_students = cursor.fetchone()

    if total_students:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {"count" : total_students[0]}
       }
    else:
       return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       } 
       
@students_router.get("/recent-complaints", tags=["Student"])
async def get_recent_complaints(request: Request):
    request_json = await request.json()
    
    cursor.execute(f"SELECT `name`,`description` FROM `student`,`complaintandquery` WHERE EXISTS( SELECT `student_id` FROM `student` JOIN ON `student_id` FROM `complaintandquery`)")
    recent_complaints = cursor.fetchall() 
           
    if len(recent_complaints) <= 2: 
        return {
                  "status": True,
                  "msg": "Retrieval successful",
                  "data": {
                    "recent complaints": recent_complaints 
                }
               }
    else:
        result = recent_complaints[-2:]
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
@students_router.get("/mess-off-students", tags=["Student"])
async def get_mess_off_students(request: Request):
    request_json = request.json()
    cursor.execute(f"SELECT `student_id`,`name`,`room_number`, (SELECT `end_date`-`start_date` AS `daysOFF` FROM `messoff`) from `student` WHERE EXISTS( SELECT `student_id` FROM `student` JOIN ON `student_id` FROM `messoff` JOIN ON  `room_number` FROM `room`)")
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

@students_router.get("/number-of-active-complaints", tags=["Student"])
async def get_active_complaints_count(request: Request):
    request_json = await request.json()

    cursor.execute(f"SELECT COUNT(`complaint_id`) FROM `complaintandquery`
                        WHERE EXISTS(
                       SELECT `student_id` FROM `student` JOIN ON
                       `student_id` FROM `complaintandquery` )AND status= pending")
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

@students_router.get("/mess-on-date", tags=["Student"])
async def get_mess_on_date(request: Request):
    request_json = await request.json()

    cursor.execute(f"""SELECT DATE_ADD(messoff.end_date, INTERVAL 1 DAY) as mess_on_date  
 from messoff JOIN student ON student.student_id=messoff.student_id""")
    
    result = cursor.fetchall()

    if result:
        return{
                "status": True,
                "msg": "Retrieval successful",
                "data": {
                    "MESS_ON_DATE": result
                }
        }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
        }
