import secrets
from smtplib import SMTPSenderRefused
import string
from fastapi import APIRouter, Body, Depends, Request
from app.my_sql_connection_cursor import cursor, connection # type: ignore
from app.mail_server import mailServer # type: ignore

staff_router = APIRouter()

@staff_router.get("/get-all-staff", tags=["Staff"])
async def get_all_staff(request: Request):
    try:
        query = "SELECT `staff_id`, `name`, `CNIC`, `phone_number`, `email` FROM `staff`"
        cursor.execute(query)
    except Exception as e:
        print(e)
        return {
            "data": [],
            "status": False,
            "msg": "Unable to get staff"
        }

    allStaff = [{"staff_id": _id, "name": name, "CNIC": cnic, "phone_number": phone_number, "email": email} for _id, name, cnic, phone_number, email in cursor.fetchall()]

    return {
        "data": allStaff,
        "status": True,
        "msg": "Get staff successful"
    }

@staff_router.post("/add-staff", tags=["Staff"])
async def add_staff(request: Request,):

    request_json = await request.json()

    name = request_json.get("name")
    CNIC = request_json.get("CNIC")
    phone_number = request_json.get("phone_number")
    email = request_json.get("email")
    image_url = request_json.get("staff_image")

    password = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
              for i in range(8))

    try:
        # send mail
        msg = mailServer.makeLoginDetailsEmailMessage(request_json["email"], str(email), str(password))
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
            "msg": "Unable to add staff"
        }

    addStaffUserQuery = f"INSERT INTO `user` (`username`, `password`, `role`, `image_path`) VALUES ('{email}', '{password}', 'staff', '{image_url}')"

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
async def update_staff(request: Request,):

    request_json = await request.json()

    staff_id = request_json.get("staff_id")
    name = request_json.get("name")
    phone_number = request_json.get("phone_number")
    image_url = request_json.get("staff_image")

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