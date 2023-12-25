from fastapi import APIRouter, Body, Depends, Request

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

cursor = connection.cursor()
cursor.execute("USE Hostelo")

print("Connected to MySQL Server")

########################################################

@students_router.post("/students", tags=["Students"])
async def get_total_students(request: Request):

    return {
        "data": "students",
        "status": True,
        "msg": "Get students successful"
    }