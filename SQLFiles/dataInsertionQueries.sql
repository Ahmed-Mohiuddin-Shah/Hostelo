USE Hostelo;

INSERT INTO
    StudentAddress (address_id, state, city, street)
VALUES (
        'A1',
        'California',
        'Los Angeles',
        '123 Main Street'
    ), (
        'A2',
        'New York',
        'New York City',
        '456 Broadway Avenue'
    ), (
        'A3',
        'Texas',
        'Houston',
        '789 Oak Lane'
    ), (
        'A4',
        'Florida',
        'Miami',
        '101 Palm Street'
    ), (
        'A5',
        'Illinois',
        'Chicago',
        '202 Pine Avenue'
    );

INSERT INTO
    StudentMedicalRecord (
        medical_id,
        problem,
        description,
        regular_medicine,
        smoker,
        blood_group
    )
VALUES (
        'M1',
        'Allergy',
        'Description1',
        'Antihistamine',
        'Y',
        'A+'
    ), (
        'M2',
        'Asthma',
        'Description2',
        'Bronchodilator',
        'N',
        'B-'
    ), (
        'M3',
        'Flu',
        'Description3',
        'Acetaminophen',
        'N',
        'O+'
    ), (
        'M4',
        'Injury',
        'Description4',
        'Pain Reliever',
        'N',
        'AB+'
    ), (
        'M5',
        'Hypertension',
        'Description5',
        'Antihypertensive',
        'Y',
        'B+'
    );

INSERT INTO
    Department (dept_id, dept_name)
VALUES ('D1', 'SEECS'), ('D2', 'SADA'), ('D3', 'ASAB'), ('D4', 'S3H'), ('D5', 'SCME');

INSERT INTO Room (room_number)
VALUES (101), (102), (103), (104), (105);

INSERT INTO
    Staff (
        staff_id,
        name,
        CNIC,
        phone_number
    )
VALUES (
        'S1',
        'John Smith',
        1234567890123,
        98765432101
    ), (
        'S2',
        'Alice Johnson',
        9876543210123,
        12345678901
    ), (
        'S3',
        'Robert Davis',
        1111111110123,
        99999999901
    ), (
        'S4',
        'Emily White',
        2222222220123,
        88888888801
    ), (
        'S5',
        'Michael Brown',
        3333333330123,
        77777777701
    );

INSERT INTO
    Student (
        student_id,
        CNIC,
        name,
        gender,
        school,
        batch,
        sem,
        address_id,
        medical_id,
        dept_id,
        room_number,
        staff_id
    )
VALUES (
        100123,
        1234561013789,
        'Ella Noor',
        'M',
        'SEECS',
        2022,
        1,
        'A1',
        'M1',
        'D1',
        101,
        'S1'
    ), (
        100245,
        9876543254321,
        'Sobia Amjad',
        'F',
        'SADA',
        2022,
        1,
        'A2',
        'M2',
        'D2',
        102,
        'S2'
    ), (
        100367,
        1111111234511,
        'Ali Azhar',
        'M',
        'S3H',
        2022,
        1,
        'A3',
        'M3 ',
        'D3',
        103,
        'S3'
    ), (
        100489,
        2222765422222,
        'Samia Bajwa',
        'F',
        'ASAB',
        2022,
        1,
        'A4',
        'M4',
        'D4',
        104,
        'S4'
    ), (
        100510,
        3398763333333,
        'Babar Waqar',
        'M',
        'SCME',
        2022,
        1,
        'A5',
        'M5',
        'D5',
        105,
        'S5'
    );

INSERT INTO
    StudentPhoneNo (phone_number, student_id)
VALUES (11122233333, 100123), (44455556666, 100245), (77778889999, 100367), (12345367890, 100489), (98765543210, 100510);

INSERT INTO
    ElectricAppliance (appliance_id, name)
VALUES (1, 'Electric Kettle'), (2, 'Fridge'), (3, 'Microwave'), (4, 'Coffee Maker'), (5, 'Microwave Oven');

INSERT INTO
    Parent (
        name,
        CNIC,
        phone_number,
        student_id
    )
VALUES (
        'Parent1',
        1111111119876,
        99955999999,
        100123
    ), (
        'Parent2',
        2222222225678,
        88888888888,
        100245
    ), (
        'Parent3',
        3333333332345,
        77766777777,
        100367
    ), (
        'Parent4',
        4444444443214,
        66664466666,
        100489
    ), (
        'Parent5',
        6555555557685,
        55225555555,
        100510
    );

INSERT INTO
    Relative (
        number,
        relation,
        CNIC,
        student_id
    )
VALUES (
        'R1',
        'Sibling',
        1234576546789,
        100123
    ), (
        'R2',
        'Cousin',
        9878765654321,
        100245
    ), (
        'R3',
        'Uncle',
        1119876111111,
        100367
    ), (
        'R4',
        'Aunt',
        2223245222222,
        100489
    ), (
        'R5',
        'Grandparent',
        3332323333333,
        100510
    );

INSERT INTO
    Asset (number, name, quantity)
VALUES (1, 'Bed', 50), (2, 'Desk', 10), (3, 'Computer', 20), (4, 'Table', 5), (5, 'Chair', 15);

INSERT INTO
    RoomType (type_id, type_name)
VALUES (1, 'Single'), (2, 'Double'), (3, 'Triple'), (4, 'Double (attach bath)'), (5, 'Double (community bath)');

INSERT INTO
    ComplaintAndQuery (
        complaint_id,
        description,
        student_id,
        staff_id
    )
VALUES (
        1,
        'Internet not working',
        100123,
        'S1'
    ), (
        2,
        'Room maintenance needed',
        100245,
        'S2'
    ), (
        3,
        'Repair Furniture',
        100367,
        'S3'
    ), (
        4,
        'Heating issue in room',
        100489,
        'S4'
    ), (
        5,
        'Billing discrepancy',
        100510,
        'S5'
    );

INSERT INTO
    RoomService (
        service_id,
        status,
        room_number,
        staff_id
    )
VALUES (1, 'Pending', 101, 'S1'), (2, 'Completed', 102, 'S2'), (3, 'Pending', 103, 'S3'), (4, 'Completed', 104, 'S4'), (5, 'Pending', 105, 'S5');

INSERT INTO
    ServiceType (
        service_type_id,
        service_name,
        service_id
    )
VALUES (1, 'Cleaning', 1), (2, 'Maintenance', 2), (3, 'Repairs', 3), (4, 'Delivery', 4), (5, 'Other', 5);

INSERT INTO
    Title (title_id, title_name, staff_id)
VALUES ('T1', 'Professor', 'S1'), (
        'T2',
        'Associate Professor',
        'S2'
    ), (
        'T3',
        'Assistant Professor',
        'S3'
    ), ('T4', 'Instructor', 'S4'), ('T5', 'Administrator', 'S5');

INSERT INTO
    Announcement (number, description, staff_id)
VALUES (
        1,
        'Welcome back to a new semester!',
        'S1'
    ), (
        2,
        'Important meeting on Friday',
        'S2'
    ), (
        3,
        'Upcoming maintenance schedule',
        'S3'
    ), (
        4,
        'Student council elections',
        'S4'
    ), (
        5,
        'Holiday closure notice',
        'S5'
    );

INSERT INTO
    Invoice (
        invoice_id,
        date_of_issuance,
        payable_amount,
        due_date,
        student_id
    )
VALUES (
        'I1',
        '2023-01-01',
        1000.00,
        '2023-01-15',
        100123
    ), (
        'I2',
        '2023-02-01',
        1200.00,
        '2023-02-15',
        100245
    ), (
        'I3',
        '2023-03-01',
        800.00,
        '2023-03-15',
        100367
    ), (
        'I4',
        '2023-04-01',
        1500.00,
        '2023-04-15',
        100489
    ), (
        'I5',
        '2023-05-01',
        900.00,
        '2023-05-15',
        100510
    );

INSERT INTO
    MessInvoice (invoice_id)
VALUES ('I1'), ('I2'), ('I3'), ('I4'), ('I5');

INSERT INTO
    ElectricApplianceInvoice (invoice_id, quantity)
VALUES ('I1', '2'), ('I2', '1'), ('I3', '3'), ('I4', '1'), ('I5', '2');

INSERT INTO
    HasAppliance (appliance_id, student_id)
VALUES ('1', 100123), ('2', 100245), ('3', 100367), ('4', 100489), ('5', 100510);

INSERT INTO
    User(username, password, role)
VALUES ('admin', 'admin', 'admin'), ('staff', 'staff', 'staff'), (
        'student',
        'student',
        'student'
    );