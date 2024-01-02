from os import close
from fastapi import FastAPI, Body, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.routes.anouncment import announcements_router
from app.routes.appliance import appliance_router
from app.routes.assets import assets_router
from app.routes.attendance import attendance_router
from app.routes.authentication import auth_router
from app.routes.complaints import complaints_router
from app.routes.invoices import invoices_router
from app.routes.mess import mess_router
from app.routes.roomservices import roomservice_router
from app.routes.rooms import rooms_router
from app.routes.staff import staff_router
from app.routes.students import students_router
from app.routes.users import users_router


def get_application() -> FastAPI:
    application = FastAPI(title="Hostelo API", debug=True)

    application.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(announcements_router, prefix="/api/announcements")
    application.include_router(appliance_router, prefix="/api/appliance")
    application.include_router(assets_router, prefix="/api/assets")
    application.include_router(attendance_router, prefix="/api/attendance")
    application.include_router(auth_router, prefix="/api/auth")
    application.include_router(complaints_router, prefix="/api/complaints")
    application.include_router(invoices_router, prefix="/api/invoice")
    application.include_router(mess_router, prefix="/api/mess")
    application.include_router(roomservice_router, prefix="/api/room-services")
    application.include_router(rooms_router, prefix="/api/rooms")
    application.include_router(staff_router, prefix="/api/staff")
    application.include_router(students_router, prefix="/api/students")
    application.include_router(users_router, prefix="/api/users")

    return application


app = get_application()
