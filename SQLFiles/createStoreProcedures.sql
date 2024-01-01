USE Hostelo;

-- ( CASE WHEN `status` <> 0 THEN 'pending' ELSE 'resolved' END )

CREATE PROCEDURE GET_STATUS(IN BOOLEANSTATUS BOOLEAN
) BEGIN SELECT 
	SELECT
	SELECT
	SELECT
	SELECT
	SELECT
	SELECT
	SELECT
	SELECT
	SELECT (
	        CASE
	            WHEN booleanStatus <> 0 THEN 'pending'
	            ELSE 'resolved'
	        END
	    ) INTO @value;
	SELECT @value;
	END;


DROP PROCEDURE IF EXISTS `GET_STATUS`;

CALL `GET_STATUS`(0);

SELECT
    `complaint_id`,
    `student_id`,
    `name`,
    `room_number`,
    `title`,
    `description`,
    `GET_STATUS`(`status`)
FROM `complaintandquery`
    NATURAL JOIN `student`
ORDER BY
    `status` DESC,
    `complaint_id` DESC

SELECT
    `complaint_id`,
    `student_id`,
    `name`,
    `room_number`,
    `title`,
    `description`,
    `GET_STATUS`(`status`)
FROM `complaintandquery`
    NATURAL JOIN `student`
ORDER BY
    `status` DESC,
    `complaint_id` DESC

CREATE FUNCTION GET_STATUS(BOOLEANSTATUS BOOLEAN) RETURNS 
VARCHAR(10) DETERMINISTIC BEGIN RETURN 
	RETURN
	RETURN
	RETURN
	RETURN
	RETURN (
	        CASE
	            WHEN booleanStatus <> 0 THEN 'pending'
	            ELSE 'resolved'
	        END
	    );
	END;


DROP FUNCTION IF EXISTS `GET_STATUS`;

SELECT *
FROM `roomservice`
    JOIN `student` USING (`student_id`)
    JOIN `staff` USING (`staff_id`)
    JOIN `servicetype` USING (`service_type_id`)
ORDER BY `request_date` DESC;