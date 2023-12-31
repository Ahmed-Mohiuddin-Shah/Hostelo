import re
from tracemalloc import start
from fastapi import APIRouter, Body, Depends, Request
from httpx import get
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

mess_router = APIRouter()

@mess_router.get("/mess-off-students", tags=["Mess"])
async def get_mess_off_students(request: Request):
    cursor.execute(f"SELECT `student_id`,`name`,`room_number`, DATE_ADD(end_date, INTERVAL 1 DAY) FROM `student` NATURAL JOIN `messoff` WHERE `end_date` > CURRENT_DATE() ORDER BY `end_date` DESC")
    result = cursor.fetchall()
    if result != None:
        return{
                "status": True,
                "msg": "Retrieval successful",
                "data": {
                    "students": result
                }
        }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
        }
    
@mess_router.post("/sign-off", tags=["Mess"])
async def sign_off_from_mess(request:Request):
    request_json = await request.json()
    email = request_json["userName"]
    start_date = request_json["startDate"]
    end_date = request_json["endDate"]
    days_off = request_json["daysOff"]
    
    print(email, start_date, end_date, days_off)

    getStudentIDQuery = f"SELECT `student_id` FROM `student` WHERE `email` = '{email}' and student_id NOT IN (SELECT `student_id` FROM `deletedstudent`)"

    try:
        cursor.execute(getStudentIDQuery)
        result = cursor.fetchone()
        if result == None:
            return {
                "status" : False,
                "msg" : "Student not found"
        }
    except Error as e:
        return {
                "status" : False,
                "msg" : "Unable to fetch student id"
        }
    
    student_id = result[0]

    getIfMessOffRequestedForSameDateQuery = f"SELECT COUNT(*) FROM `messoff` WHERE `student_id` = {student_id} AND `request_date` = CURRENT_DATE()"

    try:
        cursor.execute(getIfMessOffRequestedForSameDateQuery)
        result = cursor.fetchone()
        if result[0] > 0:   # type: ignore
            return {
                "status" : False,
                "msg" : "Mess off already requested for today"
        }
    except Error as e:
        return {
                "status" : False,
                "msg" : "Unable to fetch mess off request"
        }
    
    getCurrentDaysOffQuery = f"SELECT `daysoff` FROM `messoff` WHERE `student_id` = 407251 AND MONTH(CURRENT_DATE()) IN ( SELECT MONTH(`request_date`) FROM messoff WHERE `student_id` = 407251)"

    try:
        new_days_off = days_off
        cursor.execute(getCurrentDaysOffQuery)
        result = cursor.fetchall()
        if result != None:
            for i in result:
                new_days_off = new_days_off + i[0]

        print(result)
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch current days off"
        }
    
    if new_days_off > 12:
        return {
                "status" : False,
                "msg" : "Mess off days cannot exceed 12"
        }
    
    insertMessOffQuery = f"INSERT INTO `messoff`(`request_date`, `student_id`, `start_date`, `end_date`, `daysoff`) VALUES (CURRENT_DATE(), {student_id}, '{start_date}', '{end_date}', {days_off})"
    try:
        cursor.execute(insertMessOffQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to insert mess off request"
        }
    
    return {
                "status" : True,
                "msg" : "Mess off request successful"
        }