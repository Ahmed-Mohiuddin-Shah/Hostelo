from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore

assets_router = APIRouter()

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

@assets_router.get("/number-of-assets", tags=["Assets"])
async def get_total_students(request: Request):
    query  = f"SELECT `quantity` FROM `Asset` "
    cursor.execute(query)

    all_assets_quantity = cursor.fetchall()

    sum_of_assets = 0

    for i in all_assets_quantity:
        sum_of_assets += i[0] #type: ignore

    if all_assets_quantity:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {"count" : sum_of_assets}
        }
    else:
        return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       }