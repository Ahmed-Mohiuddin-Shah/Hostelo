create user 'ahmed'@'%' IDENTIFIED BY '1234';
create user 'aqsa'@'%' IDENTIFIED BY '1234';

GRANT select, insert, update, delete, create ON *.* TO 'ahmed'@'%' with grant option;
GRANT select, insert, update, delete, create ON *.* TO 'aqsa'@'%' with grant option;
flush privileges;