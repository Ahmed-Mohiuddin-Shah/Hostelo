SELECT COUNT(`date`) FROM `attendance` WHERE `date` = CURRENT_DATE();

UPDATE `attendance`
SET `status` = 1
WHERE
    `date` = '2023-12-27'
    AND `student_id` = 415216;