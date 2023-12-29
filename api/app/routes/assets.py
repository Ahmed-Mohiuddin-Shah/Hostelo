from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore

assets_router = APIRouter()

@assets_router.get("/number-of-assets", tags=["Assets"])
async def get_total_students(request: Request):
    query  = f"SELECT `quantity` FROM `Asset` "
    cursor.execute(query)

    all_assets_quantity = cursor.fetchall()

    sum_of_assets = 0

    for i in all_assets_quantity:
        sum_of_assets += i[0] #type: ignore

    if all_assets_quantity:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {"count" : sum_of_assets}
        }
    else:
        return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       }
    
@assets_router.get("/assets/{number}", tags=["Assets"])
async def get_asset(request: Request, number: int):

    query = f"SELECT `number`, `quantity`,`name` FROM `asset`"
    
    try:
        cursor.execute(query)
    except:
        return {
            "status": False,
            "msg": "Unable to get asset"
        }
    asset = cursor.fetchone()
    return {
        "data": asset,
        "status": True,
        "msg": "Get asset successful"
    }


@assets_router.delete("/delete-asset/{number}", tags=["Assets"])
async def delete_room(number):
    query = f"SELECT COUNT(*) FROM `room` WHERE `number` = '{number}'"
    cursor.execute(query)
    asset_exists = cursor.fetchone()
    if asset_exists[0] == 0: # type: ignore
        return {
            "status": False,
            "msg": "Asset does not exist"
        }

    query = f"DELETE FROM `asset` WHERE `number` = '{number}'"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Asset deleted successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to delete asset"
        }


@assets_router.post("/add-asset", tags=["Assets"])
async def add_asset(request: Request):
    request_json = await request.json()
    number = request_json["number"] #type: ignore
    name = request_json["name"]
    quantity = request_json["quantity"]

    query = f"SELECT COUNT(*) FROM `asset` WHERE `number` = '{number}'"
    cursor.execute(query)
    asset_exists = cursor.fetchone()
    if asset_exists[0] != 0: # type: ignore
        return {
            "status": False,
            "msg": "Asset already exists"
        }

    query = f"INSERT INTO `asset` (`number`, `quantity`,`name`) VALUES ('{number}', '{name}','{quantity}')"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Asset added successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to add asset"}
    

@assets_router.post("/edit-asset/{number}", tags=["Assets"])
async def update_asset(number, request: Request):
    request_json = await request.json()
    new_asset_name = request_json["new_asset_name"] #type: ignore
    new_asset_quantity = request_json["new_asset_quantity"] #type: ignore

    query = f"SELECT COUNT(*) FROM `asset` WHERE `number` = '{number}'"
    cursor.execute(query)
    asset_exists = cursor.fetchone()
    if asset_exists[0] == 0: # type: ignore
        return {
            "status": False,
            "msg": "Asset does not exist"
        }

    query = f"UPDATE `asset` SET `name` = '{new_asset_name}' WHERE `number` = '{number}'"
    query = f"UPDATE `asset` SET `quantity` = '{new_asset_quantity}' WHERE `number` = '{number}'"
    try:
        cursor.execute(query)
        connection.commit() # type:ignore
        return {
            "status": True,
            "msg": "Asset updated successfully"
        }
    except:
        return {
            "status": False,
            "msg": "Unable to update asset"
        }