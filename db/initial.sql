START TRANSACTION;

CREATE DATABASE VO;
CREATE USER 'VO'@'localhost';
GRANT ALL PRIVILEGES ON VO.* To 'VO'@'localhost' IDENTIFIED BY '123';

USE VO;

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `vo_option` varchar(255),
  `vo_value` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vo_settings` (`id`, `vo_option`, `vo_values`) VALUES
(1, 'org_setup','done'),
(2, 'org_name','VirtualOffice'),
(3, 'org_country','Sri Lanka'),
(4, 'email_host','smtp.gmail.com'),
(5, 'email_port','587'),
(6, 'email_address','virtualoffice.jsin38@gmail.com'),
(7, 'email_password','pnryycbvpjsibjyy');

COMMIT;
