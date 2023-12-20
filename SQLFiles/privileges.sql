create user 'ahmed'@'%' IDENTIFIED BY '1234';
create user 'aqsa'@'%' IDENTIFIED BY '1234';

GRANT all privileges ON *.* TO 'ahmed'@'%' with grant option;
GRANT all privileges ON *.* TO 'aqsa'@'%' with grant option;
flush privileges;