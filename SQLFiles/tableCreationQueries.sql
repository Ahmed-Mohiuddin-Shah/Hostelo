-- Active: 1703074437870@@26.94.210.229@3306@hostelo

USE Hostelo;

CREATE TABLE
    StudentAddress (
        address_id CHAR (2) PRIMARY KEY,
        state VARCHAR (35) NOT NULL,
        city VARCHAR (35) NOT NULL,
        street VARCHAR (20) NOT NULL
    );

CREATE TABLE
    StudentMedicalRecord (
        medical_id CHAR (2) PRIMARY KEY,
        problem VARCHAR (20),
        description VARCHAR (75),
        regular_medicine VARCHAR (20),
        smoker CHAR (1) CHECK (smoker IN ('Y', 'N')),
        blood_group CHAR (3) CHECK(
            blood_group IN (
                'A+',
                'B+',
                'O+',
                'B-',
                'A-',
                'AB+',
                'AB-',
                'O-'
            )
        )
    );

CREATE TABLE
    Department (
        dept_id CHAR (2) PRIMARY KEY,
        dept_name VARCHAR (20) NOT NULL
    );

CREATE TABLE
    RoomType (
        type_id INT PRIMARY KEY,
        type_name VARCHAR (35) NOT NULL
    );

CREATE TABLE
    Room (
        room_number INT PRIMARY KEY,
        type_id INT,
        FOREIGN KEY (type_id) REFERENCES RoomType(type_id)
    );

CREATE TABLE
    Staff (
        staff_id CHAR (2) PRIMARY KEY,
        name VARCHAR (25) NOT NULL,
        CNIC BIGINT NOT NULL UNIQUE,
        phone_number BIGINT NOT NULL UNIQUE
    );

CREATE TABLE
    Student (
        student_id INT PRIMARY KEY,
        CNIC BIGINT NOT NULL UNIQUE,
        name VARCHAR (35) NOT NULL,
        gender CHAR (7) NOT NULL CHECK (
            gender IN ('M', 'F', 'XMALE', 'XFEMALE')
        ),
        school VARCHAR (20) NOT NULL,
        batch INT NOT NULL,
        sem INT NOT NULL CHECK (
            sem BETWEEN 1 AND 10
        ),
        address_id CHAR (2),
        medical_id CHAR (2),
        dept_id CHAR (2),
        room_number INT,
        staff_id CHAR (2),
        FOREIGN KEY (address_id) REFERENCES studentAddress(address_id),
        FOREIGN KEY (medical_id) REFERENCES studentMedicalRecord(medical_id),
        FOREIGN KEY (dept_id) REFERENCES Department(dept_id),
        FOREIGN KEY (room_number) REFERENCES Room(room_number),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

CREATE TABLE
    StudentPhoneNo (
        phone_number BIGINT NOT NULL UNIQUE,
        student_id INT,
        PRIMARY KEY (student_id, phone_number),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    ElectricAppliance (
        appliance_id INT PRIMARY KEY,
        name VARCHAR (20)
    );

CREATE TABLE
    Parent (
        name VARCHAR (30) NOT NULL,
        CNIC BIGINT NOT NULL UNIQUE,
        phone_number BIGINT NOT NULL UNIQUE,
        student_id INT,
        PRIMARY KEY (student_id, name),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    Relative (
        number CHAR (2),
        relation VARCHAR (20),
        CNIC BIGINT NOT NULL UNIQUE,
        student_id INT,
        PRIMARY KEY (student_id, number),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

USE Hostelo;

DROP TABLE IF EXISTS Asset;

CREATE TABLE
    Asset (
        number INT PRIMARY KEY,
        name VARCHAR (25),
        quantity INTEGER
    );

ALTER TABLE `asset` CHANGE `quantity` `quantity` int DEFAULT 0;

UPDATE Asset ADD CONSTRAINT ck_quantity CHECK (quantity >= 0);

CREATE TABLE
    ComplaintAndQuery (
        complaint_id INT PRIMARY KEY,
        description VARCHAR (150),
        student_id INT,
        staff_id CHAR (2),
        FOREIGN KEY (student_id) REFERENCES Student(student_id),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

CREATE TABLE
    RoomService (
        service_id INT PRIMARY KEY,
        status VARCHAR (20) CHECK (
            status IN ('Pending', 'Completed')
        ),
        room_number INT,
        staff_id CHAR (2),
        FOREIGN KEY (room_number) REFERENCES Room(room_number),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

CREATE TABLE
    ServiceType (
        service_type_id INT PRIMARY KEY,
        service_name VARCHAR (25) NOT NULL,
        service_id INT,
        FOREIGN KEY (service_id) REFERENCES RoomService(service_id)
    );

CREATE TABLE
    Title (
        title_id CHAR (2) PRIMARY KEY,
        title_name VARCHAR (30) NOT NULL,
        staff_id CHAR (2),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

CREATE TABLE
    Announcement (
        number INT PRIMARY KEY,
        description VARCHAR (150),
        staff_id CHAR (2),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

CREATE TABLE
    Invoice (
        invoice_id CHAR (2) PRIMARY KEY,
        date_of_issuance DATE NOT NULL,
        payable_amount DECIMAL (9, 2) NOT NULL,
        due_date DATE NOT NULL,
        student_id INT,
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    MessInvoice (
        invoice_id CHAR (2) PRIMARY KEY,
        FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
    );

CREATE TABLE
    ElectricApplianceInvoice (
        invoice_id CHAR (2) PRIMARY KEY,
        quantity VARCHAR (5),
        FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
    );

CREATE TABLE
    HasAppliance (
        appliance_id INT,
        student_id INT,
        FOREIGN KEY (appliance_id) REFERENCES ElectricAppliance(appliance_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    MessOff (
        request_date DATE NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        student_id INT,
        PRIMARY KEY(request_date, student_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    Attendance(
        date DATE NOT NULL,
        status CHAR (1) NOT NULL CHECK (status IN ('P', 'A')),
        student_id INT,
        PRIMARY KEY(date, student_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

CREATE TABLE
    User(
        username VARCHAR(35) PRIMARY KEY,
        password VARCHAR(8) NOT NULL,
        role VARCHAR(20) NOT NULL
    );

USE Hostelo;

ALTER TABLE
    studentaddress DROP COLUMN state,
    DROP COLUMN city,
    DROP COLUMN street;

ALTER TABLE studentaddress
ADD
    COLUMN permanent_address VARCHAR(100) NOT NULL;

ALTER TABLE studentaddress
ADD
    COLUMN temporary_address VARCHAR(100) NOT NULL;

ALTER TABLE student MODIFY COLUMN CNIC VARCHAR(15) NOT NULL;

ALTER TABLE
    studentphoneno MODIFY COLUMN phone_number VARCHAR(16) NOT NULL;