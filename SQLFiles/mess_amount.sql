SELECT ((SELECT COUNT(date) from attendance) - (SELECT daysoff FROM messoff))*430 
from messoff JOIN attendance ON 
messoff.student_id=attendance.student_id;
