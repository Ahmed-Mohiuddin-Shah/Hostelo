from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

announcements_router = APIRouter()

@announcements_router.get("/get-all-announcements", tags=["Announcements"])
async def get_all_announcements(request: Request):
    try:
        query = "SELECT `announcement_id`, `title`, `description`, `announcement_date` FROM `announcement`"
        cursor.execute(query)
    except Exception as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get announcements"
        }
    
    allAnnouncements = [{"announcementID": _id, "announcementTitle": title, "announcementDescription": description, "announcementDate": date} for _id, title, description, date in cursor.fetchall()]

    return {
        "data": allAnnouncements,
        "status": True,
        "msg": "Get announcements successful"
    }

@announcements_router.post("/add-announcement", tags=["Announcements"])
async def add_announcement(request: Request,):
    request_json = await request.json()

    title = request_json.get("title")
    description = request_json.get("description")

    try:
        query = f"INSERT INTO `announcement` (`title`, `description`, `announcement_date`) VALUES ('{title}', '{description}', CURRENT_DATE())"
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

@announcements_router.delete("/delete-announcement/{annnouncment_id}", tags=["Announcements"])
async def delete_announcement(request: Request, announcement_id: int):
    try:
        query = f"DELETE FROM `announcement` WHERE `announcement_id` = {announcement_id}"
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