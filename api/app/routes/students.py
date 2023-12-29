import email
from smtplib import SMTPSenderRefused
from turtle import st, update
from fastapi import APIRouter, Body, Depends, Request
from httpx import get
from mysql.connector import connect, Error
from decouple import config # type: ignore
from app.mail_server import mailServer # type: ignore
from app.my_sql_connection_cursor import cursor, connection # type: ignore  

import string
import secrets

students_router = APIRouter()

@students_router.get("/number-of-students", tags=["Student"])
async def get_total_students(request: Request):
    query  = f"SELECT COUNT(`student_id`) FROM `Student` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`)"
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

    isDeletedQuery = f"SELECT * FROM `deletedstudent` WHERE `student_id` = {studentID}"

    try:
        cursor.execute(isDeletedQuery)
        result = cursor.fetchone()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to check if student exists"
        }
    
    if result is not None:
        if result[0] == studentID:   #type: ignore
            reAddStudentQuery = f"DELETE FROM `deletedstudent` WHERE `student_id` = {studentID}"
            try:
                cursor.execute(reAddStudentQuery)
                connection.commit() #type: ignore

                return {
                    "status": True,
                    "msg": "Student re-added successfully"
                }

            except Error as e:
                print(e)
                return {
                    "status": False,
                    "msg": "Unable to re-add student"
                }

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
            deleteLoginDetailsQuery = f"DELETE FROM `user` WHERE `username` = {str(studentID)}"
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
    except SMTPSenderRefused as emailError:
        print(emailError)
        return {
            "status": True,
            "msg": "Student added but email not sent"
        }
        

    return {
        "status": True,
        "msg": "Student added successfully"
    }

@students_router.get("/get-all-students", tags=["Student"])
async def get_all_students(request: Request):
    
    getStudentsQuery = "SELECT `student_id`, `name`, `email`, `CNIC`, `gender`, `school`, `department`, `sem`, `batch`, `room_number`, `phone_number`, `permament_address`, `temporary_address`, `problem`, `description`, `regular_medicine`, `blood_group`, `smoker` FROM `student` NATURAL JOIN `studentaddress` NATURAL JOIN `studentmedicalrecord` WHERE `student_id` NOT IN (SELECT `student_id` FROM `deletedstudent`)"
    getParents = "SELECT * FROM parent"
    getRelatives = "SELECT * FROM relative"
    getUsersQuery = "SELECT `username`, `image_path` FROM `user` WHERE `role` = 'student'"


    try:
        cursor.execute(getStudentsQuery)
        students = cursor.fetchall()

        cursor.execute(getParents)
        parents = cursor.fetchall()

        cursor.execute(getRelatives)
        relatives = cursor.fetchall()

        cursor.execute(getUsersQuery)
        users = cursor.fetchall()

        allStudentInfo = [] # type: ignore

        for student in students:
            studentInfo = {}
            studentInfo["student_id"] = student[0]
            studentInfo["student_name"] = student[1]
            studentInfo["email"] = student[2]
            studentInfo["student_cnic"] = student[3]
            studentInfo["gender"] = student[4]
            studentInfo["school"] = student[5]
            studentInfo["department"] = student[6]
            studentInfo["semester"] = student[7]
            studentInfo["batch"] = student[8]
            studentInfo["room_number"] = student[9]
            studentInfo["phone_number"] = student[10]
            studentInfo["permanent_address"] = student[11]
            studentInfo["temporary_address"] = student[12]
            studentInfo["problem"] = student[13]
            studentInfo["description"] = student[14]
            studentInfo["regular_medicine"] = student[15]
            studentInfo["blood_group"] = student[16]
            studentInfo["is_smoker"] = student[17]

            for parent in parents:
                if parent[4] == student[0]:
                    if parent[2] == "Father":
                        studentInfo["father_cnic"] = parent[0]
                        studentInfo["father_name"] = parent[1]
                        studentInfo["father_phone_number"] = parent[3]
                    elif parent[2] == "Mother":
                        studentInfo["mother_cnic"] = parent[0]
                        studentInfo["mother_name"] = parent[1]
                        studentInfo["mother_phone_number"] = parent[3]

            relativeCount = 0
            for relative in relatives:
                if relative[3] == student[0] and relativeCount < 3:
                    studentInfo[f"relative_{relativeCount + 1}_cnic"] = relative[0]
                    studentInfo[f"relative_{relativeCount + 1}_name"] = relative[1]
                    studentInfo[f"relative_{relativeCount + 1}_relation"] = relative[2]
                    relativeCount += 1

            for user in users:
                if user[0] == str(student[0]):
                    studentInfo["student_image"] = user[1]

            allStudentInfo.append(studentInfo)

    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get students"
        }

    if students:
        return {
            "status": True,
            "msg": "Retrieval successful",
            "data": allStudentInfo
        }
    else:
        return {
            "status": False,
            "msg": "Retrieval not successful"
        }

@students_router.put("/edit-student/{student_id}", tags=["Student"])
async def edit_student(request: Request, student_id: int):
    request_json = await request.json()

    getIDsQuery =f"SELECT `address_id`, `medical_id` FROM `student` WHERE `student_id` = {student_id}"

    try:
        cursor.execute(getIDsQuery)
        IDs = cursor.fetchone()
        addressID, medicalID = IDs[0], IDs[1]  #type: ignore
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to get IDs"
        }
    
    updateAddressQuery = f"UPDATE `studentaddress` SET `permament_address` = '{request_json['permanent_address']}', `temporary_address` = '{request_json['temporary_address']}' WHERE `address_id` = {addressID}"
    try:
        cursor.execute(updateAddressQuery)
        connection.commit() #type: ignore

    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update address"
        }
    
    updateMedicalRecordQuery = f"UPDATE `studentmedicalrecord` SET `problem` = '{request_json['problem']}', `description` = '{request_json['description']}', `regular_medicine` = '{request_json['regular_medicine']}', `smoker` = '{request_json['is_smoker']}', `blood_group` = '{request_json['blood_group']}' WHERE `medical_id` = {medicalID}"

    try:
        cursor.execute(updateMedicalRecordQuery)
        connection.commit() #type: ignore
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update medical record"
        }
    
    updateStudentQuery = f"UPDATE `student` SET `email` = '{request_json['email']}', `school` = '{request_json['school']}', `sem` = '{request_json['semester']}', `phone_number` = '{request_json['phone_number']}' WHERE `student_id` = {student_id}"

    try:
        cursor.execute(updateStudentQuery)
        connection.commit() #type: ignore

    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update student"
        }
    
    updateFatherQuery = f"UPDATE `parent` SET `name` = '{request_json['father_name']}', `relation` = 'Father', `phone_number` = '{request_json['father_phone_number']}' WHERE `student_id` = {student_id}"
    updateMotherQuery = f"UPDATE `parent` SET `name` = '{request_json['mother_name']}', `relation` = 'Mother', `phone_number` = '{request_json['mother_phone_number']}' WHERE `student_id` = {student_id}"
    try:
        cursor.execute(updateFatherQuery)
        cursor.execute(updateMotherQuery)
        connection.commit() #type: ignore
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update parents"
        }
    
    updateRelative1Query = f"UPDATE `relative` SET `name` = '{request_json['relative_1_name']}', `relation` = '{request_json['relative_1_relation']}' WHERE student_id = {student_id} AND `CNIC` = '{request_json['relative_1_cnic']}'"

    updateRelative2Query = f"UPDATE `relative` SET `name` = '{request_json['relative_2_name']}', relation = '{request_json['relative_2_relation']}' WHERE student_id = {student_id} AND `CNIC` = '{request_json['relative_2_cnic']}'"

    udpdateRelative3Query = f"UPDATE relative SET name = '{request_json['relative_3_name']}', relation = '{request_json['relative_3_relation']}' WHERE student_id = {student_id} AND `CNIC` = '{request_json['relative_3_cnic']}'"

    try:
        cursor.execute(updateRelative1Query)
        cursor.execute(updateRelative2Query)
        cursor.execute(udpdateRelative3Query)
        connection.commit() #type: ignore

    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to update relatives"
        }

    return {
        "status": True,
        "msg": "Student updated successfully"
    }

@students_router.delete("/delete-student/{student_id}", tags=["Student"])
async def delete_student(request: Request, student_id: int):
    deleteStudentQuery = f"INSERT INTO deletedstudent (`student_id`) VALUES ({student_id})"

    try:
        cursor.execute(deleteStudentQuery)
        connection.commit()
    except Error as e:
        print(e)
        return {
            "status": False,
            "msg": "Unable to delete student"
        }
    
    return {
        "status": True,
        "msg": "Student deleted successfully"
    }