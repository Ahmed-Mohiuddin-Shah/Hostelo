from fastapi import  FastAPI, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes.authentication import auth_router
from app.routes.students import students_router
from app.routes.rooms import rooms_router
from app.routes.assets import assets_router
from app.routes.complaints import complaints_router

def get_application() -> FastAPI:
    application = FastAPI(title="Hostelo API", debug=True)

    application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    application.include_router(auth_router, prefix="/api/auth")
    application.include_router(students_router, prefix="/api/students")
    application.include_router(rooms_router, prefix="/api/rooms")
    application.include_router(assets_router, prefix="/api/assets")
    application.include_router(complaints_router, prefix="/api/complaints") 

    return application

app = get_application()