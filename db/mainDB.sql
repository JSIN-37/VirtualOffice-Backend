START TRANSACTION;

CREATE TABLE `vo_settings` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `vo_option` varchar(255),
  `vo_value` varchar(255)
);

INSERT INTO `vo_settings` (`vo_option`, `vo_value`) VALUES
('admin_password','3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2'),
('org_setup','done'),
('org_name','VirtualOffice'),
('org_country','Sri Lanka');

CREATE TABLE `vo_user` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(255),
  `contact_number` char(10),
  `password` varchar(255),
  `dob` date,
  `gender` char(1),
  `address` varchar(400),
  `division_id` int(11)
);

CREATE TABLE `vo_division` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` varchar(500),
  `hod_id` int(11),
  FOREIGN KEY (hod_id) REFERENCES vo_user(id)
);

INSERT INTO `vo_user` (`first_name`, `last_name`, `email`, `contact_number`, `password`, `dob`, `gender`, `address`, `division_id`) VALUES
('Admin', '', 'admin@vo', '0000000000', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2021-09-09', 'A', 'VirtualOffice', NULL),
('Naushikha', 'Jayawickrama', 'naushikha@outlook.com', '0763316991', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1997-09-09', 'M', 'School Lane, Kadawatha.', NULL),
('Imashi', 'Dissanayake', 'imashi921a@gmail.com', '0703081775', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1997-09-21', 'F', 'Armpitiya, Kandy.', NULL),
('John', 'Doe', 'john.doe@gmail.com', '0123456789', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '2020-11-01', 'M', 'Sri Lanka', NULL);

CREATE TABLE `vo_role` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `create_team` int(11),
  `monitor_attendance` int(11),
  `monitor_tasks` int(11),
  `create_tasks` int(11)
);

INSERT INTO `vo_role` (`name`, `create_team`, `monitor_attendance`, `monitor_tasks`, `create_tasks`) VALUES
('Employee', 0, 0, 0, 0),
('CEO/Director', 1, 1, 1, 1);

CREATE TABLE `vo_user_role` (
  `user_id` int(11),
  `role_id`  int(11),
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES vo_user(id),
  FOREIGN KEY (role_id) REFERENCES vo_role(id)
);

INSERT INTO `vo_user_role` (`user_id`, `role_id`) VALUES
(1, 1),
(2, 2);

CREATE TABLE `vo_team` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` varchar(500),
  `leader_id`  int(11),
  `division_id`  int(11),
  FOREIGN KEY (leader_id) REFERENCES vo_user(id),
  FOREIGN KEY (division_id) REFERENCES vo_division(id)
);

CREATE TABLE `vo_team_member` (
  `team_id` int(11),
  `member_id` int(11),
  PRIMARY KEY (team_id, member_id),
  FOREIGN KEY (team_id) REFERENCES vo_team(id),
  FOREIGN KEY (member_id) REFERENCES vo_user(id)
);

CREATE TABLE `vo_worklog` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11),
  `start_time` int(11),
  `end_time` int(11),
  `full_half` CHAR(1),
  FOREIGN KEY (user_id) REFERENCES vo_user(id)
);


COMMIT;
