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
       
# @students_router.get("/mess-off-students", tags=["Student"])
# async def get_mess_off_students(request: Request):
#     request_json = request.json()
#     cursor.execute(f"SELECT `student_id`,`name`,`room_number`, (SELECT `end_date`-`start_date` AS `daysOFF` FROM `messoff`) from `student` WHERE EXISTS( SELECT `student_id` FROM `student` JOIN ON `student_id` FROM `messoff` JOIN ON  `room_number` FROM `room`)")
#     result = cursor.fetchall()
#     if result:
#         return{
#                 "status": True,
#                 "msg": "Retrieval successful",
#                 "data": {
#                     "recent complaints": result
#                 }
#         }
#     else:
#         return {
#                 "status" : False,
#                 "msg" : "Retrieval Not Successful"
#         } 