from fastapi import APIRouter, Body, Depends, Request
from httpx import get
from mysql.connector import connect, Error
from app.auth.auth_handler import decodeJWT
from app.my_sql_connection_cursor import cursor, connection  # type: ignore

roomservice_router = APIRouter()


@roomservice_router.get("/all-room-service-types", tags=["Room Service"])
async def get_all_room_service_types():
    query = "SELECT `service_type_id`, `service_name` FROM servicetype"

    try:
        cursor.execute(query)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Could room service"}

    allTypes = [{"id": row[0], "serviceType": row[1]} for row in result]

    return {
        "status": True,
        "msg": "Room service fetched successfully",
        "data": allTypes,
    }

@roomservice_router.post("/request-room-service", tags=["Room Service"])
async def request_room_service(request: Request):
    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {"status": False, "msg": "Token expired"}

    if role != "student":
        return {
            "status": False,
            "msg": "You are not authorized to request room service",
        }

    query = f"SELECT `student_id`, `room_number` FROM student WHERE `email` = '{decodedToken['username']}'"

    try:
        cursor.execute(query)
        result = cursor.fetchone()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Could not fetch student id"}

    if result == None:
        return {"status": False, "msg": "Student does not exist"}

    student_id, room_number = result

    request_json = await request.json()

    checkIfAlreadyRequestedAndPending = f"SELECT COUNT(*) FROM roomservice WHERE `student_id` = '{student_id}' AND `room_number` = {room_number} AND `service_type_id` = {request_json['serviceType']} AND GET_STATUS(`status`) = 'pending'"

    try:
        cursor.execute(checkIfAlreadyRequestedAndPending)
        result = cursor.fetchone()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Failed to request room service"}

    if result[0] > 0:  # type: ignore
        return {"status": False, "msg": "Your previous request is still pending"}

    try:
        cursor.execute(
            f"INSERT INTO `roomservice` (`student_id`, `room_number`, `service_type_id`, `status`, `request_date`) VALUES ('{student_id}', {room_number}, {request_json['serviceType']}, TRUE, CURRENT_DATE())"
        )
        connection.commit()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Failed to request room service"}

    return {"status": True, "msg": "Room service requested successfully"}

@roomservice_router.get("/all-room-services", tags=["Room Service"])
async def get_room_service_requests(request: Request):
    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {"status": False, "msg": "Token expired"}

    if role == "student":
        query = f"SELECT `service_id`, `student_id`, GET_STATUS(`status`), `room_number`, `service_name`, `request_date`, `staff_id` FROM `roomservice` NATURAL JOIN `student` NATURAL JOIN `servicetype` WHERE `email` = '{decodedToken['username']}' ORDER BY `status` DESC, `request_date` DESC "
    elif role == "worker" or role == "manager":
        query = f"SELECT `service_id`, `student_id`, `student`.`name`, GET_STATUS(`status`), `room_number`, `service_name`, `request_date`, `staff_id` FROM `roomservice` NATURAL JOIN `student` NATURAL JOIN `servicetype` ORDER BY `status` DESC, `request_date` DESC "
    elif role == "admin":
        query = f"SELECT `service_id`, `student_id`, `student`.`name`, GET_STATUS(`status`), `room_number`, `service_name`, `request_date`, `staff_id` FROM `roomservice` NATURAL JOIN `student` NATURAL JOIN `servicetype` ORDER BY `status` DESC, `request_date` DESC"
    else:
        return {
            "status": False,
            "msg": "You are not authorized to view room service requests",
        }

    try:
        cursor.execute(query)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Could not fetch room service requests at this time",
        }
    
    getStaffDetails = "SELECT `staff_id`, `name` FROM `staff`"

    try:
        cursor.execute(getStaffDetails)
        staffDetails = cursor.fetchall()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Could not fetch staff details at this time",
        }
    
    staffDetailsDict = {}
    for row in staffDetails:
        staffDetailsDict[row[0]] = row[1]

    allRequests = []

    if role == "student":
        allRequests = [
            {
                "id": row[0],
                "studentId": row[1],
                "status": row[2],
                "roomNumber": row[3],
                "serviceType": row[4],
                "requestDate": row[5],
                "staffName": staffDetailsDict.get(row[6], None)
            }
            for row in result
        ]
    elif role == "worker" or role == "manager":
        allRequests = [
            {
                "id": row[0],
                "studentId": row[1],
                "studentName": row[2],
                "status": row[3],
                "roomNumber": row[4],
                "serviceType": row[5],
                "requestDate": row[6],
                "staffName": staffDetailsDict.get(row[7], None)
            }
            for row in result
        ]
    elif role == "admin":
        allRequests = [
            {
                "id": row[0],
                "studentId": row[1],
                "studentName": row[2],
                "status": row[3],
                "roomNumber": row[4],
                "serviceType": row[5],
                "requestDate": row[6],
                "staffName": staffDetailsDict.get(row[7], None)
            }
            for row in result
        ]

    return {
        "status": True,
        "msg": "Room service requests fetched successfully",
        "data": allRequests,
    }

@roomservice_router.put("/mark-as-completed", tags=["Room Service"])
async def update_room_service_status(request: Request):
    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {"status": False, "msg": "Token expired"}
    
    if role != "worker":
        return {
            "status": False,
            "msg": "You are not authorized to update room service status",
        }
    
    request_json = await request.json()

    serviceId = request_json["id"]

    getStaffIdQuery = f"SELECT `staff_id` FROM `staff` WHERE `email` = '{decodedToken['username']}'"

    try:
        cursor.execute(getStaffIdQuery)
        result = cursor.fetchone()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Failed to update room service status"}
    
    staffId = result[0] #type: ignore

    updateQuery = f"UPDATE `roomservice` SET `status` = FALSE, `staff_id` = {staffId} WHERE `service_id` = {serviceId}"

    try:
        cursor.execute(updateQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {"status": False, "msg": "Failed to update room service status"}
    
    return {"status": True, "msg": "Room service status updated successfully"}