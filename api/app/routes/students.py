from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore

try:
  connection = connect(
        host = config("mySQLServerIP"),
        user = config("apiUserName"),
        password = config("apiPassword")
    )
except Error as e:
    print(e)

cursor = connection.cursor()
cursor.execute("USE Hostelo")


students_router = APIRouter()

@students_router.get("/students/no-of students", tags=["Students"])
async def get_total_students(request: Request):
    request_json = await request.json
    query  = f"SELECT COUNT(student_id) FROM `Student` "
    cursor.execute(query)

    total_students = cursor.fetchone()

    if total_students:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {
               "count": total_students
            }
        }
    else:
       return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       }


    
    