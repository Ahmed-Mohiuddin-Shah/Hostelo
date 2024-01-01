from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

roomservice_router = APIRouter()

@roomservice_router.get("/all-roomservice", tags=["Room Service"])
async def get_all_roomservice(request: Request):
    pass