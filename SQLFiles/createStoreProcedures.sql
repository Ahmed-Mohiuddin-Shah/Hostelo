USE Hostelo;

-- ( CASE WHEN `status` <> 0 THEN 'pending' ELSE 'resolved' END )

CREATE PROCEDURE GET_STATUS(IN BOOLEANSTATUS BOOLEAN
) BEGIN SELECT 
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