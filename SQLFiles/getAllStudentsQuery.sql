-- interface IStudent{student_image: any;

-- student_id: string;

-- student_name: string;

-- email: string;

-- student_cnic: string;

-- gender: string;

-- school: string;

-- department: string;

-- semester: string;

-- batch: string;

-- room_number: string;

-- phone_number: string;

-- permanent_address: string;

-- temporary_address: string;

-- problem: string;

-- description: string;

-- regular_medicine: string;

-- blood_group: string;

-- is_smoker: string;

-- father_name: string;

-- father_cnic: string;

-- father_phone_number: string;

-- mother_name: string;

-- mother_cnic: string;

-- mother_phone_number: string;

-- relative_1_name: string;

-- relative_1_cnic: string;

-- relative_1_relation: string;

-- relative_2_name: string;

-- relative_2_cnic: string;

-- relative_2_relation: string;

-- relative_3_name: string;

-- relative_3_cnic: string;

-- relative_3_relation: string;

-- }

SELECT
    student_id,
    name,
    email,
    `CNIC`,
    gender,
    school,
    department,
    sem,
    batch,
    room_number,
    phone_number,
    permament_address,
    temporary_address,
    problem,
    description,
    regular_medicine,
    blood_group,
    smoker
FROM student
    NATURAL JOIN studentaddress
    NATURAL JOIN studentmedicalrecord
    NATURAL JOIN user;

SELECT * FROM parent;

SELECT * FROM relative;