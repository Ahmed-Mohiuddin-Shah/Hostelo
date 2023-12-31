-- Active: 1703074437870@@26.94.210.229@3306@hostelo

CREATE DATABASE Hostelo;

USE Hostelo;

CREATE TABLE
    StudentAddress (
        address_id INTEGER PRIMARY KEY AUTO_INCREMENT,
        permament_address VARCHAR (100) NOT NULL,
        temporary_address VARCHAR (100) NOT NULL
    );

ALTER TABLE student DROP CONSTRAINT student_ibfk_1;

DROP TABLE studentaddress;

CREATE TABLE
    StudentMedicalRecord (
        medical_id INTEGER PRIMARY KEY AUTO_INCREMENT,
        problem VARCHAR (250),
        description VARCHAR (500),
        regular_medicine VARCHAR (250),
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

DROP TABLE studentmedicalrecord;

ALTER TABLE studentmedicalrecord MODIFY description VARCHAR(500);

ALTER TABLE studentmedicalrecord MODIFY problem VARCHAR(250);

ALTER TABLE
    studentmedicalrecord MODIFY regular_medicine VARCHAR(250);

DROP TABLE studentmedicalrecord;

ALTER TABLE student DROP CONSTRAINT student_ibfk_2;

CREATE TABLE
    Department (
        dept_id CHAR (2) PRIMARY KEY,
        dept_name VARCHAR (20) NOT NULL
    );

CREATE TABLE
    RoomType (
        type_id INT PRIMARY KEY,
        type_name VARCHAR (35) NOT NULL,
        slots INT NOT NULL
    );

ALTER TABLE roomtype ADD COLUMN slots INT NOT NULL;

CREATE TABLE
    Room (
        room_number INT PRIMARY KEY,
        type_id INT,
        FOREIGN KEY (type_id) REFERENCES RoomType(type_id)
    );

CREATE TABLE
    Student (
        student_id INT PRIMARY KEY,
        CNIC VARCHAR(15) NOT NULL UNIQUE,
        name VARCHAR (35) NOT NULL,
        email VARCHAR (150) NOT NULL UNIQUE,
        gender CHAR (1) NOT NULL CHECK (gender IN ('M', 'F', 'O')),
        school VARCHAR (20) NOT NULL,
        batch INT NOT NULL,
        sem INT NOT NULL CHECK (
            sem BETWEEN 1 AND 10
        ),
        department VARCHAR(20),
        address_id INTEGER,
        medical_id INTEGER,
        room_number INT,
        phone_number VARCHAR(16) NOT NULL UNIQUE,
        FOREIGN KEY (address_id) REFERENCES studentAddress(address_id),
        FOREIGN KEY (medical_id) REFERENCES studentMedicalRecord(medical_id),
        FOREIGN KEY (room_number) REFERENCES Room(room_number),
        CONSTRAINT ck_email CHECK (email LIKE '%@%')
    );

DROP TABLE student;

ALTER TABLE relative DROP CONSTRAINT relative_ibfk_1;

ALTER TABLE student ADD COLUMN phone_number VARCHAR(16) NOT NULL;

UPDATE student SET gender = 'O';

ALTER TABLE student MODIFY gender CHAR(1) NOT NULL;

SELECT *
FROM
    information_schema.TABLES
WHERE `TABLE_NAME` = "student";

ALTER TABLE student MODIFY medical_id INTEGER;

UPDATE student SET medical_id = 1;

ALTER TABLE student ADD COLUMN email VARCHAR(150) NOT NULL;

ALTER TABLE student ADD UNIQUE (email);

ALTER TABLE student
ADD
    FOREIGN KEY (address_id) REFERENCES studentAddress(address_id);

ALTER TABLE student
ADD
    FOREIGN KEY (medical_id) REFERENCES studentMedicalRecord(medical_id);

ALTER TABLE student
ADD
    CONSTRAINT ck_email CHECK (email LIKE '%@%');

ALTER TABLE student
ADD
    CONSTRAINT ck_gender CHECK (gender IN ('M', 'F', 'O'));

ALTER TABLE student DROP CONSTRAINT student_ibfk_5;

ALTER TABLE student DROP CONSTRAINT student_chk_1;

ALTER TABLE student DROP COLUMN dept_id;

ALTER TABLE student ADD COLUMN department VARCHAR(20) NOT NULL;

CREATE TABLE
    StudentPhoneNo (
        phone_number VARCHAR (16) NOT NULL,
        student_id INT,
        PRIMARY KEY (student_id, phone_number),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

DROP TABLE studentphoneno;

CREATE TABLE
    ElectricAppliance (
        appliance_id INTEGER AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR (20)
    );

DROP TABLE electricappliance;

DROP TABLE hasappliance;

CREATE TABLE
    Parent (
        CNIC VARCHAR(15) NOT NULL,
        name VARCHAR (100) NOT NULL,
        relation VARCHAR (20) NOT NULL CHECK (
            relation IN ('Mother', 'Father', 'Gaurdian')
        ) DEFAULT "Garudian",
        phone_number VARCHAR(13) NOT NULL,
        student_id INT,
        PRIMARY KEY (student_id, CNIC),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

ALTER TABLE parent MODIFY name VARCHAR(100) NOT NULL;

ALTER TABLE parent MODIFY CNIC VARCHAR(15) NOT NULL UNIQUE;

ALTER TABLE parent MODIFY phone_number VARCHAR(13) NOT NULL UNIQUE;

DROP TABLE Parent;

ALTER TABLE parent
ADD
    COLUMN relation VARCHAR(20) DEFAULT "Garudian" NOT NULL CHECK (
        relation IN ('Mother', 'Father', 'Gaurdian')
    );

CREATE TABLE
    Relative (
        CNIC VARCHAR(15) NOT NULL,
        name VARCHAR (100) NOT NULL,
        relation VARCHAR (20),
        student_id INT,
        PRIMARY KEY (student_id, CNIC),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

ALTER TABLE relative MODIFY name VARCHAR(100) NOT NULL;

DROP TABLE relative

USE Hostelo;

DROP TABLE IF EXISTS Asset;

CREATE TABLE
    Asset (
        number INTEGER AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR (25),
        quantity INTEGER
    );

DROP TABLE asset;

ALTER TABLE `asset` CHANGE `quantity` `quantity` int DEFAULT 0;

UPDATE Asset ADD CONSTRAINT ck_quantity CHECK (quantity >= 0);

CREATE TABLE
    Invoice (
        invoice_id INTEGER PRIMARY KEY,
        date_of_issuance DATE NOT NULL,
        payable_amount DECIMAL (9, 2) NOT NULL,
        due_date DATE NOT NULL,
        student_id INT,
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

DROP TABLE invoice;

CREATE TABLE
    MessInvoice (
        invoice_id INTEGER PRIMARY KEY,
        FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
    );

DROP TABLE messinvoice;

CREATE TABLE
    ElectricApplianceInvoice (
        invoice_id INTEGER PRIMARY KEY,
        quantity VARCHAR (5),
        FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id)
    );

DROP TABLE electricapplianceinvoice;

CREATE TABLE
    HasAppliance (
        appliance_id INT,
        student_id INT,
        FOREIGN KEY (appliance_id) REFERENCES ElectricAppliance(appliance_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

DROP TABLE hasappliance;

CREATE TABLE
    MessOff (
        request_date DATE NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        student_id INT,
        PRIMARY KEY(request_date, student_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

DROP TABLE messoff;

CREATE TABLE
    Attendance(
        date DATE NOT NULL,
        status BOOLEAN NOT NULL,
        student_id INT,
        PRIMARY KEY(date, student_id),
        FOREIGN KEY (student_id) REFERENCES Student(student_id)
    );

DROP TABLE attendance;

CREATE TABLE
    User(
        username VARCHAR(150) PRIMARY KEY,
        password VARCHAR(8) NOT NULL,
        role VARCHAR(20) NOT NULL,
        image_path VARCHAR(500) NOT NULL
    );

ALTER TABLE
    `user` MODIFY COLUMN `username` VARCHAR(150) NOT NULL UNIQUE;

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

ALTER TABLE parent MODIFY COLUMN CNIC VARCHAR(15) NOT NULL;

ALTER TABLE parent MODIFY COLUMN phone_number VARCHAR(16) NOT NULL;

ALTER TABLE relative MODIFY COLUMN CNIC VARCHAR(15) NOT NULL;

ALTER TABLE user ADD COLUMN image_path VARCHAR(500) NOT NULL;

ALTER TABLE student DROP CONSTRAINT student_ibfk_5;

ALTER TABLE student DROP COLUMN staff_id CASCADE;

TRUNCATE TABLE student;

TRUNCATE TABLE parent;

TRUNCATE TABLE invoice;

TRUNCATE TABLE messinvoice;

CREATE TABLE deletedstudent (student_id INTEGER PRIMARY KEY);

CREATE TABLE
    Staff (
        staff_id INTEGER AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR (50) NOT NULL,
        CNIC VARCHAR (15) NOT NULL UNIQUE,
        phone_number VARCHAR (16) NOT NULL UNIQUE
    );

DROP TABLE staff;

CREATE TABLE
    ComplaintAndQuery (
        complaint_id INTEGER AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR (500),
        student_id INTEGER,
        staff_id INTEGER,
        status BOOLEAN NOT NULL,
        FOREIGN KEY (student_id) REFERENCES Student(student_id),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

DROP TABLE complaintandquery;

CREATE TABLE
    RoomService (
        service_id INTEGER AUTO_INCREMENT PRIMARY KEY,
        status BOOLEAN NOT NULL,
        room_number INTEGER,
        staff_id INTEGER,
        service_type_id INTEGER,
        FOREIGN KEY (room_number) REFERENCES Room(room_number),
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id),
        FOREIGN KEY (service_type_id) REFERENCES ServiceType(service_type_id)
    );

DROP TABLE roomservice;

CREATE TABLE
    Announcement (
        number INTEGER AUTO_INCREMENT PRIMARY KEY,
        description VARCHAR (500),
        staff_id INTEGER,
        FOREIGN KEY (staff_id) REFERENCES Staff(staff_id)
    );

DROP TABLE announcement;

CREATE TABLE
    ServiceType (
        service_type_id INTEGER AUTO_INCREMENT PRIMARY KEY,
        service_name VARCHAR (50) NOT NULL
    );

DROP TABLE servicetype;