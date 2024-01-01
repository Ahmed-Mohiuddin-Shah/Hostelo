from turtle import title
from uu import decode
from fastapi import APIRouter, Body, Depends, Request
from app.auth.auth_handler import decodeJWT
from mysql.connector import connect, Error
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
    cursor.execute(f"SELECT `title`, (CASE WHEN `status` <> 0 THEN 'pending' ELSE 'resolved' END) FROM `student` NATURAL JOIN `complaintandquery` WHERE `status` = 1 ORDER BY `complaint_id` DESC")
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

@complaints_router.get("/all-complaints", tags=["Complaints"])
async def get_complaints(request: Request):

    token = request.headers["Authorization"] #type: ignore
    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
        username = decodedToken["username"]
    except:
        return {
            "status": False,
            "msg": "Token expired"
        }

    query = ""

    if role == "admin" or role == "manager":
        query = f"SELECT `complaint_id`, `student_id`, `name`, `room_number`, `title`, `description`, (CASE WHEN `status` <> 0 THEN 'pending' ELSE 'resolved' END) FROM `complaintandquery` NATURAL JOIN `student` ORDER BY `status` DESC, `complaint_id` DESC"
    else:
        query = f"SELECT `complaint_id`, `title`, `description`, (CASE WHEN `status` <> 0 THEN 'pending' ELSE 'resolved' END) FROM `complaintandquery` NATURAL JOIN `student` WHERE `email` = '{username}' ORDER BY `status` DESC, `complaint_id` DESC"

    try:
        cursor.execute(query)
        complaints = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while fetching complaints"
        }
    
    if role == "admin" or role == "manager":
        allComplaints = [{"complaint_id": complaint_id, "student_id": _id, "student_name": name, "room_number": room_number, "title": title, "description": description, "status": status} for complaint_id, _id, name, room_number, title, description, status in complaints]
    else:
        allComplaints = [{"complaint_id": complaint_id, "title": title, "description": description, "status": status} for complaint_id, title, description, status in complaints]

    return {
        "status": True,
        "msg": "Retrieval successful",
        "data": allComplaints
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

@complaints_router.delete("/delete-complaint/{complaint_id}", tags=["Complaints"])
async def delete_complaint(request: Request, complaint_id: int):

    token = request.headers["Authorization"] #type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {
            "status": False,
            "msg": "Token expired"
        }

    if role == "student":
        try:
            cursor.execute(f"DELETE FROM `complaintandquery` WHERE `complaint_id` = {complaint_id}")
            connection.commit()
        except Error as e:
            print(e)
            return {
                "status": False,
                "msg": "Error while deleting complaint"
            }

        return {
            "status": True,
            "msg": "Complaint deleted successfully",
        }
    
    return {
        "status": False,
        "msg": "Only students can delete complaints"
    }

@complaints_router.put("/update-complaint/{complaint_id}", tags=["Complaints"])
async def update_complaint(request: Request, complaint_id: int):
    request_json = await request.json()

    token = request.headers["Authorization"] #type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {
            "status": False,
            "msg": "Token expired"
        }
    
    if role == "student":
        updateQuery = f"UPDATE `complaintandquery` SET `title` = '{request_json['title']}', `description` = '{request_json['description']}' WHERE `complaint_id` = {complaint_id}"
    else:
        print(request_json["status"])
        isResolved = 0 if request_json["status"] == "resolved" else 1
        print(isResolved)
        updateQuery = f"UPDATE `complaintandquery` SET `status` = {isResolved} WHERE `complaint_id` = {complaint_id}"

    try:
        cursor.execute(updateQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Error while updating complaint"
        }
    
    return {
        "status": True,
        "msg": "Complaint updated successfully",
    }