START TRANSACTION;

CREATE DATABASE VO;
CREATE USER 'VO'@'localhost';
GRANT ALL PRIVILEGES ON VO.* To 'VO'@'localhost' IDENTIFIED BY '123';

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `vo_option` varchar(255),
  `vo_value` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vo_settings` (`vo_option`, `vo_value`) VALUES
('admin_password','3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'),
('org_setup','done'),
('org_name','VirtualOffice'),
('org_country','Sri Lanka');

COMMIT;
