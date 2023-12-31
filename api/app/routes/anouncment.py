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