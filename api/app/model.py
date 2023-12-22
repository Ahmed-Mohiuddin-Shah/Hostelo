from pydantic import BaseModel, Field, EmailStr

class UserSchema(BaseModel):
    username: EmailStr = Field(...)
    password: str = Field(...)
    class Config:
        schema_extra = {
            "example": {
                "username": "467329",
                "password": "password"
            }
        }

class UserLoginSchema(BaseModel):
    username: EmailStr = Field(...)
    password: str = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "uswername": "467329",
                "password": "password"
            }
        }
