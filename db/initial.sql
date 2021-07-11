START TRANSACTION;

CREATE DATABASE VO;
CREATE USER 'VO'@'localhost';
GRANT ALL PRIVILEGES ON VO.* To 'VO'@'localhost' IDENTIFIED BY '123';

USE VO;

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY,
  `option` varchar(255),
  `value` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vo_settings` (`id`, `option`, `value`) VALUES
(0, 'org_setup','not-done'),
(1, 'org_name','VirtualOffice'),
(2, 'org_country','Sri Lanka'),
(3, 'email_host',''),
(4, 'email_port',''),
(5, 'email_address',''),
(6, 'email_password','');

COMMIT;
