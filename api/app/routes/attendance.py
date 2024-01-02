from tabnanny import check
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from app.auth.auth_handler import decodeJWT # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

attendance_router = APIRouter()

@attendance_router.get("/student-details", tags=["Attendance"])
async def student_details(request: Request):
    
    getStudentsQuery = "SELECT `email`, `student_id`, `name`, `room_number` FROM `student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`) ORDER BY `room_number` ASC"
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
            if student[0] == user[0]:  #type: ignore
                allStudentInfo.append({
                    "student_id": student[1],
                    "name": student[2],
                    "room_number": student[3],
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
    request_json = await request.json()

    checkAttendanceQuery = "SELECT COUNT(`date`) FROM `attendance` WHERE `date` = CURRENT_DATE()"

    try:
        cursor.execute(checkAttendanceQuery)
        attendanceCount = cursor.fetchone()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while fetching attendance"
        }
    
    if attendanceCount[0] > 0:  # type: ignore
        return {
            "status": False,
            "msg": "Attendance already marked for today"
        }
    
    markAttendanceQuery = "INSERT INTO `attendance` (`date`, `status`, `student_id`) VALUES (CURRENT_DATE(), %s, %s)"

    studentsAttendanceDetails = []

    for student in request_json.get('students'):
        attendanceStatus = 1 if student.get('isPresent') is True else 0
        studentsAttendanceDetails.append((attendanceStatus, student.get('student_id')))

    try:
        cursor.executemany(markAttendanceQuery, studentsAttendanceDetails)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while marking attendance"
        }

    return {
        "status": True,
        "msg": "Attendance marked successfully"
    }

@attendance_router.get("/get-attendance", tags=["Attendance"])
async def get_attendance(request: Request):

    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    role = decodedToken.get("role", None)

    if role is None:
        return {"status": False, "msg": "Role is not defined"}

    username = decodedToken["username"]

    if role == "student":
        getAttendanceQuery = f"SELECT `email`, `student_id`, name, `room_number`, `date`, `status` FROM `attendance` NATURAL JOIN `student` WHERE `email` IN ('{username}') ORDER BY `date` DESC"
    else:
        getAttendanceQuery = "SELECT `email`, `student_id`, name, `room_number`, `date`, `status` FROM `attendance` NATURAL JOIN `student` ORDER BY `date` DESC"

    getUsersQuery = "SELECT `username`, `image_path` FROM `user` WHERE `role` = 'student'"

    try:
        cursor.execute(getAttendanceQuery)
        attendance = cursor.fetchall()
        cursor.execute(getUsersQuery)
        users = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while fetching attendance"
        }
    
    allAttendanceInfo = [] # type: ignore
    for student in attendance:
        for user in users:
            if student[0] == user[0]:  #type: ignore
                allAttendanceInfo.append({
                    "student_id": student[1],
                    "name": student[2],
                    "room_number": student[3],
                    "date": student[4],
                    "status": True if student[5] == 1 else False,
                    "student_image": user[1]
                })
    
    return {
        "status": True,
        "data": allAttendanceInfo,
        "msg": "Attendance fetched successfully"
    }

@attendance_router.put("/edit-attendance/{student_id}", tags=["Attendance"])
async def edit_attendance(student_id: int, request: Request):
    request_json = await request.json()

    editAttendanceQuery = f"UPDATE `attendance` SET `status` = {1 if request_json.get('status') is True else 0} WHERE `student_id` = {student_id} AND `date` = '{request_json.get('date')}'"

    try:
        cursor.execute(editAttendanceQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while editing attendance"
        }
    
    return {
        "status": True,
        "msg": "Attendance edited successfully"
    }