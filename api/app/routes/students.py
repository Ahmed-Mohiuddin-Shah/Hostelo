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
    else:
       return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       }
    
@students_router.get("/number-of-free-slots", tags=["Student"])           
async def get_available_student_slots(request: Request):
    request_json = await request.json
    query = f"SELECT COUNT(`single(attach bath)`) AS No_ofSingle_Rooms
        FROM `roomtype` "
    cursor.execute(query)
    single_occupancy = cursor.fetchone()

    query = f"SELECT COUNT(`triple`) FROM `roomtype` "
    cursor.execute(query)
    triple_occupancy = cursor.fetchone()

    query = f"SELECT COUNT(`double(attach bath)`) FROM `roomtype`"
    cursor.execute(query)
    biseater_w_attachbath = cursor.fetchone()

    query = f"SELECT COUNT(`double`)  FROM `roomtype`"
    cursor.execute(query)
    biseater = cursor.fetchone()

    total_rooms =  single_occupancy + triple_occupancy + biseater_w_attachbath + biseater

    cursor.execute(f"SELECT COUNT(student_id) FROM `Student` ")
    total_students = cursor.fetchone()
    available_student_slots = total_rooms - total_students
    
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

@students_router.get("/number-of-assets", tags=["Student"])  
    async def get_assets(request: Request):
       request_json = await request.json
       cursor.execute(f"SELECT COUNT(number) FROM `asset`")
       total_assets = cursor.fetchone()
       result = total_students[0]
       if result:
           return {
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
       
@students_router.get("/recent-complaints", tags=["Student"])
    async def get_recent_complaints(request: Request):
        request_json = await request.json()
    
        cursor.execute(f"SELECT `name`,`description` FROM `student`,`complaintandquery`
                        WHERE EXISTS(
                       SELECT `student_id` FROM `student` JOIN ON
                       `student_id` FROM `complaintandquery`)")
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
    cursor.execute(f"SELECT `student_id`,`name`,`room_number`,
                (SELECT `end_date`-`start_date` AS `daysOFF` FROM `messoff`)
                from `student` WHERE EXISTS(
                SELECT `student_id` FROM `student` JOIN ON
                `student_id` FROM `messoff` JOIN ON 
                `room_number` FROM `room`)")
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
