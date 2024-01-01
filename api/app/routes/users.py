from uu import Error
from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore

users_router = APIRouter()

