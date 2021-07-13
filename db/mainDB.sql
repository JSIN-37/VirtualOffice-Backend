START TRANSACTION;

CREATE TABLE `user` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(255),
  `contact_number` char(10),
  `password` varchar(255),
  `dob` date,
  `gender` char(1),
  `address` varchar(400)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `contact_number`, `password`, `dob`, `gender`, `address`) VALUES
(1, 'Admin', '', 'admin@vo', '0000000000', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2021-09-09', 'A', 'VirtualOffice'),
(2, 'Naushikha', 'Jayawickrama', 'naushikha@outlook.com', '0763316991', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1997-09-09', 'M', 'School Lane, Kadawatha.'),
(3, 'Imashi', 'Dissanayake', 'imashi921a@gmail.com', '0703081775', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1997-09-21', 'F', 'Armpitiya, Kandy.'),
(4, 'John', 'Doe', 'john.doe@gmail.com', '0123456789', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2020-11-01', 'M', 'Sri Lanka');

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `option` varchar(255),
  `value` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `vo_settings` (`id`, `option`, `value`) VALUES
(1, 'org_setup','done'),
(2, 'org_name','VirtualOffice'),
(3, 'org_country','Sri Lanka'),
(4, 'email_host','smtp.gmail.com'),
(5, 'email_port','587'),
(6, 'email_address','virtualoffice.jsin38@gmail.com'),
(7, 'email_password','pnryycbvpjsibjyy');

COMMIT;
