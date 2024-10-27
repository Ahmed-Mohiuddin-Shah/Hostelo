create user 'ahmed'@'%' IDENTIFIED BY '1234';
create user 'aqsa'@'%' IDENTIFIED BY '1234';
create user 'api'@'%' IDENTIFIED BY 'ThePassword';

GRANT all privileges ON *.* TO 'ahmed'@'%' with grant option;
GRANT all privileges ON *.* TO 'aqsa'@'%' with grant option;
GRANT select ON hostelo.user TO 'api'@'%' with grant option;

ALTER USER 'root'@'localhost' IDENTIFIED BY '1234';
flush privileges;