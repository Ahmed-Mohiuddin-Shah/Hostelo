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