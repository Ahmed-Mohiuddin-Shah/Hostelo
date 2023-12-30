-- DONE
INSERT INTO
    studentaddress (
        permament_address,
        temporary_address
    )
VALUES ('Islamabad', 'Islamabad');

SELECT address_id FROM student WHERE student_id = 407251;

UPDATE studentaddress
SET
    permament_address = 'Islamabad',
    temporary_address = 'Islamabad'
WHERE address_id = 1;

-- DONE
INSERT INTO
    studentmedicalrecord (
        problem,
        description,
        regular_medicine,
        smoker,
        blood_group
    )
VALUES (
        'Allergy',
        'Description1',
        'Antihistamine',
        'Y',
        'A+'
    );

SELECT medical_id FROM student WHERE student_id = 407251;

UPDATE studentmedicalrecord
SET
    problem = 'Allergy',
    description = 'Description1',
    regular_medicine = 'Antihistamine',
    smoker = 'Y',
    blood_group = 'A+'
WHERE medical_id = 1;

-- DONE
INSERT INTO
    student (
        student_id,
        CNIC,
        name,
        gender,
        school,
        batch,
        sem,
        address_id,
        medical_id,
        room_number,
        department,
        email,
        phone_number
    )
VALUES (
        '12334',
        '46546-4645546-5',
        'asdfasdf',
        'O',
        'seecs',
        '2222',
        '1',
        '1',
        '1',
        '123',
        'CS',
        'example32@gmail.com',
        '1321 231 2312'
    );

UPDATE student
SET
    email = "muhammadhamzam1486@gmail.com",
    school = "sada",
    sem = 4,
    phone_number = "0342 179 8786"
WHERE student_id = 407251;

-- DONE
INSERT INTO
    parent (
        CNIC,
        name,
        relation,
        phone_number,
        student_id
    )
VALUES (
        '46546-4654546-5',
        'asdfasdf',
        'Father',
        '1353 532 4523',
        12333
    ), (
        '12312-3123123-1',
        'adfasdfasdfasdfasdfasdfasdf',
        'Mother',
        '1214 124 3232',
        12333
    );

UPDATE parent
SET
    `name` = 'asdfasdf',
    `relation` = 'Father',
    `phone_number` = '1353 532 4523'
WHERE `student_id` = 407251;

UPDATE parent
SET
    `name` = 'asdfasdf',
    `relation` = 'Mother',
    `phone_number` = '1353 532 4523'
WHERE `student_id` = 407251;

-- DONE
INSERT INTO
    relative (
        CNIC,
        name,
        relation,
        student_id
    )
VALUES (
        '12312-3123123-1',
        'SADFASDFADFASDFASDFq',
        'Relative 1',
        12333
    ), (
        '12123-1231231-2',
        'sfsfafasfasfsdfasdfasdf',
        'Relative 2',
        12333
    ), (
        '12412-4124142-1',
        'sfasdfasfasdfasdfasdf',
        'Relative 3',
        12333
    );

UPDATE relative
SET
    name = 'SADFASDFADFASDFASDFq',
    relation = 'Relative 1'
WHERE
    student_id = 407251
    AND `CNIC` = "11111-1111111-3";

UPDATE relative
SET
    name = 'SADFFASDFq',
    relation = 'Relative 2'
WHERE
    student_id = 407251
    AND `CNIC` = "11111-1111111-4";

UPDATE relative
SET
    name = 'SADFASDFADFASDFASDFq',
    relation = 'Relative 1'
WHERE
    student_id = 407251
    AND `CNIC` = "11111-1111111-3";