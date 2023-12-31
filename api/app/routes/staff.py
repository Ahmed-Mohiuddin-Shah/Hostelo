import re
import secrets
from smtplib import SMTPSenderRefused
import string
from tabnanny import check
from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore
from app.mail_server import mailServer # type: ignore

staff_router = APIRouter()

@staff_router.get("/get-all-staff", tags=["Staff"])
async def get_all_staff(request: Request):
    try:
        query = "SELECT `staff_id`, `name`, `CNIC`, `phone_number`, `email` FROM `staff` WHERE `staff_id` NOT IN (SELECT `staff_id` FROM `deletedstaff`)"
        cursor.execute(query)
    except Exception as e:
        print(e)
        return {
            "data": [],
            "status": False,
            "msg": "Unable to get staff"
        }
    
    allStaff = [{"staffID": _id, "staffName": name, "staffCnic": cnic, "staffPhone": phone_number, "staffEmail": email} for _id, name, cnic, phone_number, email in cursor.fetchall()]

    query2 = "SELECT `username`, `image_path`, role FROM `user` WHERE `role` != 'student'"

    try:
        cursor.execute(query2)
        users = cursor.fetchall()
    except Exception as e:
        print(e)
        return {
            "data": [],
            "status": False,
            "msg": "Unable to get staff"
        }
    
    for staff in allStaff:
        for user in users:
            if staff["staffEmail"] == user[0]:
                staff["staffImage"] = user[1]
                staff["staffRole"] = user[2]

    return {
        "data": allStaff,
        "status": True,
        "msg": "Get staff successful"
    }

@staff_router.post("/add-staff", tags=["Staff"])
async def add_staff(request: Request,):

    request_json = await request.json()

    name = request_json.get("staffName")
    CNIC = request_json.get("staffCnic")
    phone_number = request_json.get("staffPhone")
    email = request_json.get("staffEmail")
    image_url = request_json.get("staffImage")
    role = request_json.get("staffRole")

    checkIfManagerExists = f"SELECT COUNT(*) FROM `user` WHERE `role` = 'manager'"
    try:
        cursor.execute(checkIfManagerExists)
        if cursor.fetchone()[0] > 0: #type: ignore
            return {
                "status": False,
                "msg": "Manager already exists"
    }
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable check if manager exists"
        }

    password = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
              for i in range(8))
    
    checkEmailQuery = f"SELECT COUNT(*) FROM `staff` WHERE `email` = '{email}'"
    try:
        cursor.execute(checkEmailQuery)
        if cursor.fetchone()[0] > 0: #type: ignore
            return {
                "status": False,
                "msg": "Email already exists"
            }
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable check if email exists"
        }

    try:
        # send mail
        msg = mailServer.makeLoginDetailsEmailMessage(email, str(email), str(password))
        mailServer.sendEmail(msg)
        print("Mail sent")
    except SMTPSenderRefused:
        print("Unable to send email")
        return {
            "status": False,
            "msg": "Please use a valid email address"
        }

    try:
        query = f"INSERT INTO `staff` (`name`, `CNIC`, `phone_number`, `email`) VALUES ('{name}', '{CNIC}', '{phone_number}', '{email}')"
        cursor.execute(query)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Duplicate CNIC or Phone Number"
        }

    addStaffUserQuery = f"INSERT INTO `user` (`username`, `password`, `role`, `image_path`) VALUES ('{email}', '{password}', '{role}', '{image_url}')"

    try:
        cursor.execute(addStaffUserQuery)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to add staff User"
        }

    return {
        "status": True,
        "msg": "Add staff successful"
    }

@staff_router.put("/update-staff/{staff_id}", tags=["Staff"])
async def update_staff(request: Request, staff_id: int):

    request_json = await request.json()

    name = request_json.get("staffName")
    CNIC = request_json.get("staffCnic")
    phone_number = request_json.get("staffPhone")
    email = request_json.get("staffEmail")
    image_url = request_json.get("staffImage")
    role = request_json.get("staffRole")

    try:
        query = f"UPDATE `staff` SET `name` = '{name}', `phone_number` = '{phone_number}' WHERE `staff_id` = {staff_id}"
        query2 = f"UPDATE `user` SET `image_path` = '{image_url}' WHERE `username` = (SELECT `email` FROM `staff` WHERE `staff_id` = {staff_id})"
        cursor.execute(query)
        cursor.execute(query2)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update staff"
        }

    return {
        "status": True,
        "msg": "Update staff successful"
    }

@staff_router.delete("/delete-staff/{staff_id}", tags=["Staff"])
async def delete_staff(request: Request, staff_id: int):
    pass

    deletedStaffQuery = f"INSERT INTO `deletedstaff` (`staff_id`) VALUES ({staff_id})"

    try:
        cursor.execute(deletedStaffQuery)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to delete staff"
        }
    
    getStaffEmailQuery = f"SELECT `email` FROM `staff` WHERE `staff_id` = '{staff_id}'"

    try:
        cursor.execute(getStaffEmailQuery)
        email = cursor.fetchone()[0] #type: ignore

        deleteStudentUserQuery = f"DELETE FROM `user` WHERE `username` = '{email}'"

        cursor.execute(deleteStudentUserQuery)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to delete staff"
        }
    
    return {
        "status": True,
        "msg": "Staff deleted successfully"
    }