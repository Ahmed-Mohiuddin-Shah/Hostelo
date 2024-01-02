from functools import partial
from re import S
from smtplib import SMTPException
from typing import Callable, List
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore
from app.mail_server import mailServer # type: ignore

import asyncio

announcements_router = APIRouter()

@announcements_router.get("/all-announcements", tags=["Announcements"])
async def get_all_announcements(request: Request):
    try:
        query = "SELECT `announcement_id`, `title`, `description`, `announcement_date` FROM `announcement` ORDER BY `announcement_date` DESC"
        cursor.execute(query)
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get announcements"
        }
    
    allAnnouncements = [{"id": _id, "title": title, "description": description, "date": date} for _id, title, description, date in cursor.fetchall()]

    return {
        "data": allAnnouncements,
        "status": True,
        "msg": "Get announcements successful"
    }

@announcements_router.post("/add-announcement", tags=["Announcements"])
async def add_announcement(request: Request):
    request_json = await request.json()

    title = request_json.get("title")
    description = request_json.get("description")

    try:
        query = f"""INSERT INTO `announcement` (`title`, `description`, `announcement_date`) VALUES ('{title}', '{description}', CURRENT_DATE())"""
        cursor.execute(query)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to add announcement"
        }

    return {
        "status": True,
        "msg": "Add announcement successful"
    }

@announcements_router.put("/update-announcement/{annnouncment_id}", tags=["Announcements"])
async def update_announcement(request: Request, announcement_id: int):
    request_json = await request.json()

    title = request_json.get("title")
    description = request_json.get("description")

    try:
        query = f"""UPDATE `announcement` SET `title` = '{title}', `description` = '{description}', `announcement_date` = CURRENT_DATE() WHERE `announcement_id` = {announcement_id}"""
        cursor.execute(query)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update announcement"
        }
    
    getEmailsQuery = "SELECT `username` FROM `user` WHERE `role` = 'student'"

    try:
        cursor.execute(getEmailsQuery)
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get emails"
        }
    
    emails = cursor.fetchall()

    getManagerQuery = "SELECT `name` FROM `staff` WHERE `email` = (SELECT `username` FROM `user` WHERE `role` = 'manager')"
    try:
        cursor.execute(getManagerQuery)
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get manager"
        }
    
    managerName = cursor.fetchone()[0] #type: ignore
    
    emailList = []
    for email in emails:
        emailList.append(email[0]) #type: ignore

    emailCSV = ", ".join(emailList)

    msg = mailServer.makeEditAnnouncementEmailMessage(to=emailCSV, title=title, description=description, managerName=managerName, role="Hostelo Manager") # type: ignore

    try:
        mailServer.sendEmail(msg)  #type: ignore
    except SMTPException as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to send emails"
        }

    return {
        "status": True,
        "msg": "Update announcement successful"
    }

@announcements_router.delete("/delete-announcement/{annnouncment_id}", tags=["Announcements"])
async def delete_announcement(announcement_id):

    query = f"DELETE FROM `announcement` WHERE `announcement_id` = {announcement_id}"
    
    try:
        cursor.execute(query)
        connection.commit()
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to delete announcement"
        }

    return {
        "status": True,
        "msg": "Delete announcement successful"
    }