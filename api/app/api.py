import time
from fastapi import  FastAPI, Body, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes.authentication import router

#################################################

#################################################


origins = ["*"]

def get_application() -> FastAPI:
    application = FastAPI(title="Hostelo API", debug=True)

    application.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    application.include_router(router, prefix="/api")

    return application


app = get_application()