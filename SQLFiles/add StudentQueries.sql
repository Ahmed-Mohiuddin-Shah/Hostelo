-- {"student_image": "/images/uploads/1703730467799-user-01.png",
-- "student_id": "12333",
-- "student_name": "asdfasdf",
-- "student_cnic": "46546-4654546-5",
-- "gender": "M",
-- "school": "seecs",
-- "department": "CS",
-- "semester": "1",
-- "batch": "2222",
-- "room_number": "123   ",
-- "phone_number": "1321 231 2312",
-- "permanent_address": "fadfadsfasdfasdf",
-- "temporary_address": "asdfasdfasfasdf",
-- "problem": "asdfasfadsfasdf",
-- "description": "asfasdfasdfasdf",
-- "regular_medicine": "asdfasdfasdf",
-- "blood_group": "A+",
-- "is_smoker": false,
-- "father_name": "asdfasfasdf",
-- "father_cnic": "12341-2412341-2",
-- "father_phone_number": "1353 532 4523",
-- "mother_name": "adfasdfasdfasdfasdfasdfasdf",
-- "mother_cnic": "12312-3123123-1",
-- "mother_phone_number": "1214 124 3232",
-- "relative_1_name": "SADFASDFADFASDFASDFq",
-- "relative_1_cnic": "12312-3123123-1",
-- "relative_1_phone": "1231 231 2312",
-- "relative_2_name": "sfsfafasfasfsdfasdfasdf",
-- "relative_2_cnic": "12123-1231231-2",
-- "relative_2_phone": "1212 312 3123",
-- "relative_3_name": "sfasdfasfasdfasdfasdf",
-- "relative_3_cnic": "12412-4124142-1",
-- "relative_3_phone": "1414 214 2142"}

INSERT INTO address ( permanent_address, temporary_address );

SELECT room_number FROM student;
-- get rooms occupied by students
SELECT room_number FROM room;
-- get all rooms
SELECT room_number
FROM room
WHERE room_number NOT IN (
        SELECT room_number
        FROM student
    );
-- get all rooms not occupied by students

SELECT
    room_number,
    type_id, (
        slots - COUNT(DISTINCT room_number)
    ) AS availableSlots
FROM student
    JOIN room USING (room_number)
    JOIN roomtype USING (type_id)
GROUP BY room_number
HAVING availableSlots > 0;

--get rooms that have students but also free slots