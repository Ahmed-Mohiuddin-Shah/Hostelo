from fastapi import APIRouter, Body, Depends, Request
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.mail_server import mailServer # type: ignore

import string
import secrets

students_router = APIRouter()

########################################################

from decouple import config # type: ignore
from mysql.connector import connect, Error

try:
    connection = connect(
        host = config("mySQLServerIP"),
        user = config("apiUserName"),
        password = config("apiPassword")
    )
except Error as e:
    print(e)

cursor = connection.cursor() # type: ignore
cursor.execute("USE Hostelo")

print("Connected to MySQL Server")

########################################################

@students_router.get("/number-of-students", tags=["Student"])
async def get_total_students(request: Request):
    query  = f"SELECT COUNT(student_id) FROM `Student` "
    cursor.execute(query)

    total_students = cursor.fetchone()

    if total_students:
       return {
            "status": True,
            "msg": "Retrieval successful",
            "data": {"count" : total_students[0]}
       }
    else:
       return {
          "status" : False,
          "msg" : "Retrieval Not Successful"
       }

@students_router.post("/add-student", tags=["Student"])
async def add_student(request: Request):

    request_json = await request.json()
    print(request_json)

    studentID = int(request_json['student_id'])

    addAddressQuery = f"INSERT INTO `studentaddress` ( `permament_address`, `temporary_address` ) VALUES ('{request_json['permanent_address']}', '{request_json['temporary_address']}')"
    getAddressIDQuery = "SELECT MAX(`address_id`) FROM `studentaddress`"

    isSmoker = 'Y' if request_json['is_smoker'] else 'N'
    addMedicalRecordQuery = f"INSERT INTO `studentmedicalrecord` ( `problem`, `description`, `regular_medicine`, `smoker`, `blood_group` ) VALUES ( '{request_json['problem']}', '{request_json['description']}', '{request_json['regular_medicine']}', '{isSmoker}', '{request_json['blood_group']}')"
    getMedicalRecordIDQuery = "SELECT MAX(`medical_id`) FROM `studentmedicalrecord`"


    addParentsQuery = f"INSERT INTO `parent` ( `CNIC`, `name`, `relation`, `phone_number`, `student_id` ) VALUES ( '{request_json['father_cnic']}', '{request_json['father_name']}', 'Father', '{request_json['father_phone_number']}', {studentID} ), ( '{request_json['mother_cnic']}', '{request_json['mother_name']}', 'Mother', '{request_json['mother_phone_number']}', {studentID} )"
    addRelativesQuery = f"INSERT INTO `relative` ( `CNIC`, `name`, `relation`, `student_id` ) VALUES ( '{request_json['relative_1_cnic']}', '{request_json['relative_1_name']}', '{request_json['relative_1_relation']}', {studentID} ), ( '{request_json['relative_2_cnic']}', '{request_json['relative_2_name']}', '{request_json['relative_2_relation']}', {studentID} ), ( '{request_json['relative_3_cnic']}', '{request_json['relative_3_name']}', '{request_json['relative_3_relation']}', {studentID} )"


    addressID = 0
    medicalID = 0

    res = ''.join(secrets.choice(string.ascii_uppercase + string.digits)
              for i in range(8))
    loginDetailsQuery = f"INSERT INTO `user` ( `username`, `password`, `role`, `image_path` ) VALUES ( '{str(studentID)}', '{str(res)}', 'student', '{request_json['student_image']}' )"
    
    try:

        query1 = "SELECT room_number FROM room WHERE room_number NOT IN ( SELECT room_number FROM student )"
        query2 = "SELECT room_number, type_id, ( slots - COUNT(DISTINCT room_number) ) AS availableSlots FROM student JOIN room USING (room_number) JOIN roomtype USING (type_id) GROUP BY room_number HAVING availableSlots > 0;"
        rooms_with_free_slots = []
        cursor.execute(query1)
        result1 = cursor.fetchall();
        for i in result1:
            rooms_with_free_slots.append(i[0])
        cursor.execute(query2)
        result2 = cursor.fetchall();
        for i in result2:
            rooms_with_free_slots.append(i[0])

        print(rooms_with_free_slots)

        if (rooms_with_free_slots == []):
            return {
                "status": False,
                "msg": "No free rooms available"
            }

        #check if student already exists
        studentExistsQuery = f"SELECT * FROM `student` WHERE `student_id` = {studentID}"
        cursor.execute(studentExistsQuery)
        student = cursor.fetchone()
        if student:
            return {
                "status": False,
                "msg": "Student already exists"
            }

        # add address
        cursor.execute(addAddressQuery)
        connection.commit() #type: ignore
        print("Address added")

        # get address id
        cursor.execute(getAddressIDQuery)
        addressID = cursor.fetchone()[0] #type: ignore
        connection.commit() #type: ignore
        print("Address ID fetched")

        # add medical record
        cursor.execute(addMedicalRecordQuery)
        connection.commit() #type: ignore
        print("Medical record added")
        
        # get medical id
        cursor.execute(getMedicalRecordIDQuery)
        medicalID = cursor.fetchone()[0] #type: ignore  
        connection.commit() #type: ignore
        print("Medical ID fetched")

        # add student
        addStudentQuery = f"INSERT INTO `student` ( `student_id`, `CNIC`, `name`, `gender`, `school`, `batch`, `sem`, `address_id`, `medical_id`, `room_number`, `department`, `email`, `phone_number` ) VALUES ( '{studentID}', '{request_json['student_cnic']}', '{request_json['student_name']}', '{request_json['gender']}', '{request_json['school']}', '{request_json['batch']}', '{request_json['semester']}', '{addressID}', '{medicalID}', '{request_json['room_number']}', '{request_json['department']}', '{request_json['email']}', '{request_json['phone_number']}' )"
        cursor.execute(addStudentQuery)
        connection.commit() #type: ignore
        print("Student added")

        # add parents
        cursor.execute(addParentsQuery)
        connection.commit() #type: ignore
        print("Parents added")

        # add relatives
        cursor.execute(addRelativesQuery)
        connection.commit() #type: ignore
        print("Relatives added")

        # add login details
        cursor.execute(loginDetailsQuery)
        connection.commit() #type: ignore
        print("Login details added")

        # send mail
        msg = mailServer.makeLoginDetailsEmailMessage(request_json["email"], str(studentID), str(res))
        mailServer.sendEmail(msg)
        print("Mail sent")

    except Error as e:
        print(e)

        try:
            # delete address
            deleteAddressQuery = f"DELETE FROM `studentaddress` WHERE `address_id` = {addressID}"
            cursor.execute(deleteAddressQuery)
            connection.commit() #type: ignore

            # delete medical record
            deleteMedicalRecordQuery = f"DELETE FROM `studentmedicalrecord` WHERE `medical_id` = {medicalID}"
            cursor.execute(deleteMedicalRecordQuery)
            connection.commit() #type: ignore

            # delete students
            deleteStudentQuery = f"DELETE FROM `student` WHERE `student_id` = {studentID}"
            cursor.execute(deleteStudentQuery)
            connection.commit() #type: ignore

            # delete parents
            deleteParentsQuery = f"DELETE FROM `parent` WHERE `student_id` = {studentID}"
            cursor.execute(deleteParentsQuery)
            connection.commit() #type: ignore

            # delete relatives
            deleteRelativesQuery = f"DELETE FROM `relative` WHERE `student_id` = {studentID}"
            cursor.execute(deleteRelativesQuery)
            connection.commit() #type: ignore

            # delete login details
            deleteLoginDetailsQuery = f"DELETE FROM `user` WHERE `username` = {studentID}"
            cursor.execute(deleteLoginDetailsQuery)
            connection.commit() #type: ignore

        except Error as e:
            print(e)
            return {
                "status": False,
                "msg": "Student not added"
            }

        return {
            "status": False,
            "msg": "Student not added"
        }

    return {
        "status": True,
        "msg": "Student added successfully"
    }

