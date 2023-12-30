from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

attendance_router = APIRouter()

@attendance_router.post("/mark-attendance", tags=["Attendance"])
async def mark_attendance(request: Request):
    request_json = await request.json()
    return {
        "status": False,
        "msg": "Not implementted yet"
    }