from fastapi import  FastAPI, Body, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routes.authentication import auth_router
from app.routes.students import students_router

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


    return application


app = get_application()