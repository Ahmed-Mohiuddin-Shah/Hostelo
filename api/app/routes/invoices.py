import decimal
from smtplib import SMTPSenderRefused
from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from app.auth.auth_handler import decodeJWT # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore
from app.mail_server import mailServer # type: ignore

invoices_router = APIRouter()

@invoices_router.post("/generate-mess-invoices", tags=["Invoices"])
async def generate_mess_invoices(request: Request):

    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {"status": False, "msg": "Token expired"}
    
    if role != "manager" and role != "admin":
        return {
            "status": False,
            "msg": "You are not authorized to generate invoices",
        }
    
    managerName = decodedToken["name"]

    request_json = await request.json()

    date = request_json["invoiceDate"]
    perDayCost = request_json["perDayCost"]

    checkIfInvoiceAlreadyGeneratedQuery = f"SELECT COUNT(*) FROM `mess_invoice` WHERE MONTH(`date_of_issuance`) = MONTH('{date}')"
    try:
        cursor.execute(checkIfInvoiceAlreadyGeneratedQuery)
        result = cursor.fetchone()
        if result[0] > 0:   # type: ignore
            return {
                "status" : False,
                "msg" : "Mess invoices already generated for current Month"
            }
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch if mess invoices already generated"
        }

    getStudentIDsQuery = f"SELECT `student_id`, `name`, `email` FROM `student` WHERE student_id NOT IN (SELECT `student_id` FROM `deletedstudent`)"

    try:
        cursor.execute(getStudentIDsQuery)
        result = cursor.fetchall()
        if result == None:
            return {
                "status" : False,
                "msg" : "Student not found"
        }
    except Error as e:
        return {
                "status" : False,
                "msg" : "Unable to fetch student id"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "No students found"
        }
    
    students = []
    for student in result:
        students.append({"studentID" : student[0], "name": student[1], "email" : student[2]})

    getCurrentDaysOffQuery = f"SELECT student_id, SUM(`daysOff`) AS totalDaysOff FROM ( SELECT `student_id`, `daysOff` FROM `messoff` WHERE MONTH(`request_date`) = MONTH('{date}') AND YEAR(`request_date`) = YEAR('{date}') AND `student_id` NOT IN ( SELECT `student_id` FROM `deletedstudent` ) ) filtered_data GROUP BY `student_id`;"

    try:
        cursor.execute(getCurrentDaysOffQuery)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch current days off"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "No students with mess off found"
        }
    
    for student in students:
        student["daysOff"] = 0
        for row in result:
            if row[0] == student["studentID"]:
                student["daysOff"] = row[1]
                break

    verifyStudebtAttendanceQuery = f"SELECT `student_id`, SUM(`status`) AS `present` FROM ( SELECT `student_id`, `status` FROM `attendance` WHERE MONTH(`date`) = MONTH('{date}') AND YEAR(`date`) = YEAR('{date}') AND `student_id` NOT IN ( SELECT `student_id` FROM `deletedstudent` ) ) filtered_data GROUP BY `student_id`;"

    try:
        cursor.execute(verifyStudebtAttendanceQuery)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch current days off"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "Students Attendance not found"
        }

    for student in students:
        student["daysPresent"] = 0
        for row in result:
            if row[0] == student["studentID"]:
                student["daysPresent"] = row[1]
                break

    getNumberOfDaysInMonthQuery = f"SELECT DAY(LAST_DAY('{date}')) AS `daysInMonth`"

    try:
        cursor.execute(getNumberOfDaysInMonthQuery)
        result = cursor.fetchone()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch number of days in month"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "Number of days in month not found"
        }
    
    daysInMonth = result[0]

    for student in students:
        student["daysAbsent"] = daysInMonth - student["daysPresent"]
        if student["daysAbsent"] < student["daysOff"]:
            student["daysOff"] = student["daysAbsent"]
        student["totalCost"] = (daysInMonth - student["daysOff"]) * decimal.Decimal(perDayCost)

    for student in students:
        createMessInvoiceQuery = f"INSERT INTO `mess_invoice` (`date_of_issuance`, `payable_amount`, `due_date`, `student_id`, `status`) VALUES ('{date}', {student['totalCost']}, DATE_ADD('{date}', INTERVAL 7 DAY), {student['studentID']}, FALSE)"
        try:
            cursor.execute(createMessInvoiceQuery)
            connection.commit()
        except Error as e:
            print(e)
            return {
                    "status" : False,
                    "msg" : "Unable to create mess invoice"
            }
        
        getMessInvoiceIDQuery = f"SELECT `invoice_id` FROM `mess_invoice` WHERE `student_id` = {student['studentID']} AND `date_of_issuance` = '{date}'"
        try:
            cursor.execute(getMessInvoiceIDQuery)
            result = cursor.fetchone()
        except Error as e:
            print(e)
            return {
                    "status" : False,
                    "msg" : "Unable to fetch mess invoice id"
            }
        
        if result == None:
            return {
                "status" : False,
                "msg" : "Mess invoice id not found"
            }
        
        student["invoiceID"] = result[0]

        try:
            messMessage = mailServer.makeMessInvoiceEmailMessage(to=student["email"], studentID=student["studentID"], invoiceDate=date, invoiceID=student["invoiceID"], studentName=student["name"], daysOff=student["daysOff"], totalCost=student["totalCost"], managerName=managerName, role=role)
            mailServer.sendEmail(messMessage)
        except SMTPSenderRefused:
            return {"status": False, "msg": "Unable to send email"}

    return {
        "status" : True,
        "msg" : "Mess invoices generated successfully"
    }

@invoices_router.post("/generate-electricity-invoices", tags=["Invoices"])
async def generate_electric_invoices(request: Request):

    token = request.headers["Authorization"]  # type: ignore

    decodedToken = decodeJWT(token)

    try:
        role = decodedToken["role"]
    except:
        return {"status": False, "msg": "Token expired"}
    
    if role != "manager" and role != "admin":
        return {
            "status": False,
            "msg": "You are not authorized to generate invoices",
        }
    
    managerName = decodedToken["name"]

    request_json = await request.json()

    date = request_json["invoiceDate"]
    perApplianceCost = request_json["perApplianceBill"]

    checkIfInvoiceAlreadyGeneratedQuery = f"SELECT COUNT(*) FROM `electric_invoice` WHERE MONTH(`date_of_issuance`) = MONTH('{date}')"
    try:
        cursor.execute(checkIfInvoiceAlreadyGeneratedQuery)
        result = cursor.fetchone()
        if result[0] > 0:   # type: ignore
            return {
                "status" : False,
                "msg" : "Mess invoices already generated for current Month"
            }
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch if mess invoices already generated"
        }

    getStudentIDsQuery = f"SELECT `student_id`, `name`, `email` FROM `student` WHERE student_id NOT IN (SELECT `student_id` FROM `deletedstudent`)"

    try:
        cursor.execute(getStudentIDsQuery)
        result = cursor.fetchall()
        if result == None:
            return {
                "status" : False,
                "msg" : "Student not found"
        }
    except Error as e:
        return {
                "status" : False,
                "msg" : "Unable to fetch student id"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "No students found"
        }
    
    students = []
    for student in result:
        students.append({"studentID" : student[0], "name": student[1], "email" : student[2]})
    
    getStudentAppliancesQuery = f"SELECT `student_id`, COUNT(`appliance_id`) FROM `hasappliance` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`) GROUP BY `student_id`"
    
    try:
        cursor.execute(getStudentAppliancesQuery)
        result = cursor.fetchall()
        if result == None:
            return {
                "status" : False,
                "msg" : "Students not found"
        }
    except Error as e:
        return {
                "status" : False,
                "msg" : "Unable to fetch students appliances"
        }
    
    for student in students:
        student["appliances"] = 0
        for row in result:
            if row[0] == student["studentID"]:
                student["appliances"] = row[1]
                break

    for student in students:
        createElectricityInvoiceQuery = f"INSERT INTO `electric_invoice` (`date_of_issuance`, `payable_amount`, `due_date`, `student_id`, `status`) VALUES ('{date}', {student['appliances'] * perApplianceCost}, DATE_ADD('{date}', INTERVAL 7 DAY), {student['studentID']}, FALSE)"
        try:
            cursor.execute(createElectricityInvoiceQuery)
            connection.commit()
        except Error as e:
            print(e)
            return {
                    "status" : False,
                    "msg" : "Unable to create Electric invoice"
            }
        
        getElectricInvoiceIDQuery = f"SELECT `invoice_id` FROM `electric_invoice` WHERE `student_id` = {student['studentID']} AND `date_of_issuance` = '{date}'"
        try:
            cursor.execute(getElectricInvoiceIDQuery)
            result = cursor.fetchone()
        except Error as e:
            print(e)
            return {
                    "status" : False,
                    "msg" : "Unable to fetch Electric invoice id"
            }
        
        if result == None:
            return {
                "status" : False,
                "msg" : "Electric invoice id not found"
            }
        
        student["invoiceID"] = result[0]

        try:
            electricMessage = mailServer.makeElectricInvoiceEmailMessage(to=student["email"], studentID=student["studentID"], invoiceDate=date, invoiceID=student["invoiceID"], studentName=student["name"], totalCost=student["appliances"] * perApplianceCost, managerName=managerName, role=role)
            mailServer.sendEmail(electricMessage)
        except SMTPSenderRefused:
            return {"status": False, "msg": "Unable to send email"}

    return {
        "status" : True,
        "msg" : "Electric invoices generated successfully"
    }

@invoices_router.get("/get-mess-invoices", tags=["Invoices"])
async def get_mess_invoices(request: Request):

    token = request.headers["Authorization"]
    decodedToken = decodeJWT(token)

    role = decodedToken.get("role")

    if role is None:
        return {"status": False, "msg": "Token expired"}
    
    username = decodedToken["username"]
    
    if role == "student":
        getInvoicesQuery = f"SELECT `invoice_id`, `student_id`, `name`, `room_number`, `payable_amount`, `date_of_issuance`, `due_date`, GET_INVOICE_STATUS(`status`) FROM `mess_invoice` NATURAL JOIN `student` WHERE `email` = '{username}' ORDER BY `date_of_issuance` DESC"
    else: 
        getInvoicesQuery = f"SELECT `invoice_id`, `student_id`, `name`, `room_number`, `payable_amount`, `date_of_issuance`, `due_date`, GET_INVOICE_STATUS(`status`) FROM `mess_invoice` NATURAL JOIN `student` ORDER BY `date_of_issuance` DESC"

    try:
        cursor.execute(getInvoicesQuery)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch mess invoices"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "Mess invoices not found"
        }
    
    invoices = []
    for invoice in result:
        if invoice[4] > 0: #type: ignore
            invoices.append({"id" : invoice[0], "studentId": invoice[1], "studentName": invoice[2] ,"roomNumber": invoice[3], "amount" : invoice[4], "issueDate" : invoice[5], "dueDate": invoice[6], "status" : invoice[7]})

    return {
        "data" : invoices,
        "status" : True,
        "msg" : "Mess invoices fetched successfully"
    }

@invoices_router.get("/get-electricity-invoices", tags=["Invoices"])
async def get_electricity_invoices(request: Request):

    token = request.headers["Authorization"]
    decodedToken = decodeJWT(token)

    role = decodedToken.get("role")

    if role is None:
        return {"status": False, "msg": "Token expired"}
    
    username = decodedToken["username"]
    
    if role == "student":
        getInvoicesQuery = f"SELECT `invoice_id`, `student_id`, `name`, `room_number`, `payable_amount`, `date_of_issuance`, `due_date`, GET_INVOICE_STATUS(`status`) FROM `electric_invoice` NATURAL JOIN `student` WHERE `email` = '{username}' ORDER BY `date_of_issuance` DESC"
    else: 
        getInvoicesQuery = f"SELECT `invoice_id`, `student_id`, `name`, `room_number`, `payable_amount`, `date_of_issuance`, `due_date`, GET_INVOICE_STATUS(`status`) FROM `electric_invoice` NATURAL JOIN `student` ORDER BY `date_of_issuance` DESC"

    try:
        cursor.execute(getInvoicesQuery)
        result = cursor.fetchall()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to fetch electric invoices"
        }
    
    if result == None:
        return {
            "status" : False,
            "msg" : "Electric invoices not found"
        }
    
    invoices = []
    for invoice in result:
        if invoice[4] > 0: #type: ignore
            invoices.append({"id" : invoice[0], "studentId": invoice[1], "studentName": invoice[2] ,"roomNumber": invoice[3], "amount" : invoice[4], "issueDate" : invoice[5], "dueDate": invoice[6], "status" : invoice[7]})

    return {
        "data" : invoices,
        "status" : True,
        "msg" : "Electric invoices fetched successfully"
    }

@invoices_router.post("/mark-as-paid", tags=["Invoices"])
async def mark_as_paid(request: Request):

    token = request.headers["Authorization"]
    decodedToken = decodeJWT(token)

    role = decodedToken.get("role")

    if role is None:
        return {"status": False, "msg": "Token expired"}

    request_json = await request.json()

    invoiceID = request_json["id"]
    invoiceType = request_json["type"]

    if role != "manager" and role != "admin":
        return {
            "status": False,
            "msg": "You are not authorized to mark invoices as paid",
        }
    
    if invoiceType == "mess":
        markAsPaidQuery = f"UPDATE `mess_invoice` SET `status` = TRUE WHERE `invoice_id` = {invoiceID}"
    else:
        markAsPaidQuery = f"UPDATE `electric_invoice` SET `status` = TRUE WHERE `invoice_id` = {invoiceID}"

    try:
        cursor.execute(markAsPaidQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
                "status" : False,
                "msg" : "Unable to mark invoice as paid"
        }
    
    return {
        "status" : True,
        "msg" : "Invoice marked as paid successfully"
    }