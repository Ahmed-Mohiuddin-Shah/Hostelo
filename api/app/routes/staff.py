from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore

staff_router = APIRouter()

@staff_router.get("/get-all-staff", tags=["Staff"])
async def get_all_staff(request: Request):
    query = "SELECT * FROM `staff`"
    cursor.execute(query)
    staff = cursor.fetchall()

    return {
        "data": staff,
        "status": True,
        "msg": "Get staff successful"
    }