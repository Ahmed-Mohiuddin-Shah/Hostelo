from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

invoices_router = APIRouter()

@invoices_router.get("/all-invoices", tags=["Invoices"])
async def get_all_invoices(request: Request):
    pass