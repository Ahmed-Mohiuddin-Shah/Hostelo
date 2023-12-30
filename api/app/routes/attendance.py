from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

attendance_router = APIRouter()

@attendance_router.get("/student-details", tags=["Attendance"])
async def student_details(request: Request):
    
    getStudentsQuery = "SELECT `student_id`, `name`, `room_number` FROM `student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`) ORDER BY `room_number` ASC"
    getUsersQuery = "SELECT `username`, `image_path` FROM `user` WHERE `role` = 'student'"

    try:
        cursor.execute(getStudentsQuery)
        students = cursor.fetchall()
        cursor.execute(getUsersQuery)
        users = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while fetching students"
        }
    
    allStudentInfo = [] # type: ignore
    for student in students:
        for user in users:
            if student[0] == int(user[0]):  #type: ignore
                allStudentInfo.append({
                    "student_id": student[0],
                    "name": student[1],
                    "room_number": student[2],
                    "student_image": user[1]
                })
                break

    return {
        "status": True,
        "data": allStudentInfo,
        "msg": "Student details fetched successfully",
    }

@attendance_router.post("/mark-attendance", tags=["Attendance"])
async def mark_attendance(request: Request):
    # request_json = await request.json()
    return {
        "status": False,
        "msg": "Not implementted yet"
    }