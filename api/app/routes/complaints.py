from turtle import title
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

complaints_router = APIRouter()

@complaints_router.get("/number-of-active-complaints", tags=["Complaints"])
async def get_active_complaints_count(request: Request):
    cursor.execute(f"SELECT COUNT(`complaint_id`) FROM `complaintandquery` WHERE EXISTS(SELECT `student_id` FROM `student` JOIN `complaintandquery` USING (`student_id`) WHERE `status`= 1)")
    result = cursor.fetchall()

    if result:
         return{
                "status": True,
                "msg": "Retrieval successful",
                "data": {
                    "count": result
                }
        }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
        }

@complaints_router.get("/recent-complaints", tags=["Complaints"])
async def get_recent_complaints(request: Request):
    cursor.execute(f"SELECT `title`, (CASE WHEN `status` <> 0 THEN 'Active' ELSE 'Resolved' END) FROM `student` NATURAL JOIN `complaintandquery` WHERE `status` = 1 ORDER BY `complaint_id` DESC")
    recent_complaints = cursor.fetchall() 
           
    if len(recent_complaints) <= 2: 
        return {
                  "status": True,
                  "msg": "Retrieval successful",
                  "data": {
                    "recent_complaints": recent_complaints 
                }
               }
    else:
        result = recent_complaints[-3:]
    if result:
        return{
                  "status": True,
                  "msg": "Retrieval successful",
                  "data": {
                    "recent_complaints": result
                   }
                }
    else:
        return {
                "status" : False,
                "msg" : "Retrieval Not Successful"
            }
    
@complaints_router.post("/add-complaint", tags=["Complaints"])
async def add_complaint(request: Request):
    request_json = await request.json()

    studentEmail = request_json["studentId"]
    title = request_json["title"]
    description = request_json["description"]

    if studentEmail == "admin":
        return {
            "status": False,
            "msg": "Admin cannot add complaint"
        }
    
    getStudentIDQuery = f"SELECT `student_id` FROM `student` WHERE `email` = '{studentEmail}'"

    try:
        cursor.execute(getStudentIDQuery)
        student_id = cursor.fetchone()[0] #type: ignore
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while fetching student id"
        }

    if student_id is None:
        return {
            "status": False,
            "msg": "Student does not exist"
        }    

    try:
        cursor.execute(f"INSERT INTO `complaintandquery` (`student_id`, `title`, `description`, `status`) VALUES ({student_id}, '{title}', '{description}', TRUE)")
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while adding complaint"
        }

    return {
        "status": True,
        "msg": "Complaint added successfully",
    }