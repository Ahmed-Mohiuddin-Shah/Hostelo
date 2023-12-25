from fastapi import APIRouter, Body, Depends, Request

students_router = APIRouter()

@students_router.post("/students", tags=["Students"])
async def get_total_students(request: Request):

    return {
        "data": "students",
        "status": True,
        "msg": "Get students successful"
    }