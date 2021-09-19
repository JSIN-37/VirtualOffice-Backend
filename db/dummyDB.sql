START TRANSACTION;


INSERT INTO `vo_user` (`id`, `first_name`, `last_name`, `email`, `contact_number`, `password`, `dob`, `gender`, `address`, `division_id`) VALUES
(5, 'Janadhi', 'Uyanhewa', 'uyanhewajanadhi@gmail.com', '0768333893', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '0000-00-00', 'F', '4/2, Udahamulla, Nugegoda', 3),
(6, 'Queen', 'Ulrich', 'ulrichqueen@gmail.com', '0768333893', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-08-16', 'F', '14/2, Rail way road, Nugegoda', 3),
(7, 'Shakya', 'Abeytunge', 'shakya@gmail.com', '0761234567', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-09-03', 'F', '21, Flower Lane, Battaramulla', 2),
(8, 'Sidath', 'Samarasekara', 'sidath@gmail.com', '0761235689', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-09-23', 'M', '12, Nawam Mawatha,Battaramulla', 3),
(9, 'Alex', 'Perera', 'alexpere12@gmail.com', '0714214532', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-09-12', 'M', '12, Great Avenue, Puerto Rico', 2),
(10, 'Anne', 'Frank', 'aneefrank12@hotmail.com', '0712892341', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-09-04', 'M', '31, Check Lane, Germany', 3),
(11, 'Catherine', 'Heathcliff', 'catherineh12@hotmial.com', '0731319834', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1982-07-12', 'F', '9, De Mel Lane, Greenpath', 5),
(12, 'Maxim', 'Gowky', 'maxime128@gmail.com', '0721348892', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1976-12-11', 'M', '121, Swarna Place, Nawala', 6),
(13, 'Maxine', 'Backer', 'maxine128@gmail.com', '0721128922', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1986-12-11', 'M', '211, Silva Place, Nawala', 6),
(14, 'Frank', 'Cullen', 'cullenfrank12@gmail.com', '0718881118', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1988-10-22', 'M', '211,Houston Av, Mahawela', 5),
(15, 'Dan', 'Brown', 'brown12dan@hotmail.com', '0711118822', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-10-21', 'F', '0', 6),
(16, 'Daniella', 'Broadway', 'bruadway12112dan@hotmail.com', '0711112132', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1989-10-21', 'F', '21, Flower Avenue, Melwela', 6),
(17, 'Daniel', 'Cullen', 'daniel@ucsc.cmb.lk', '0718881823', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-09-21', 'F', '54, Nimble Ave, Nawala', 7),
(18, 'Henry', 'Trump', 'trumpd@gmail.com', '0711111782', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1967-09-12', 'F', '1,Houston Lane, Nugegoda', 7),
(19, 'Gregory', 'Swift', 'gregory@hotmail.com', '0711128973', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-01-21', 'M', '2, FLower Lane, Battaramulla', 5),
(20, 'Serene', 'Wells', 'wellss12@gmail.com', '0731342211', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-12-21', 'F', '21, Fin Lane, Nugegoda', 6),
(21, 'Ginny', 'Austin', 'austinmiller@hotmail.com', '0981231234', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1982-09-12', 'M', '21, Fin Avenue, Nawala', 8),
(22, 'Ginny', 'Backer', 'ginnybacker@hotmail.com', '0713332121', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1997-12-21', 'F', '21, Main street, Colombo07', 4),
(23, 'Georgia', 'Miller', 'millerg@gmail.com', '0711129121', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1972-09-21', 'F', '83, Suburb, Melbourne', 2),
(24, 'Simon', 'Conwell', 'conwellsimon@gmail.com', '0212131293', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1971-04-03', 'M', '7, Main Avenue, Kings Road, Greenpath', 3),
(25, 'Passepartout', 'Miller', 'passepartout@hotmail.com', '0813312345', '42, Queens Lane, Colombo 10', '1968-03-12', 'M', '12, 3rd floor, Kings Complex', 2);


INSERT INTO `vo_division` (`id`, `name`, `description`, `hod_id`) VALUES
(2, 'General Administration', NULL, 1),
(3, 'Academic & Publications', NULL, 2),
(4, 'Examinations & Registration', NULL, 3),
(5, 'Establishments', NULL, 4),
(6, 'Postgraduate & Quality Assurance', NULL, 8),
(7, 'External Degrees Centre', NULL, 6),
(8, 'Director’s Office', NULL, 7),
(9, 'Academic, Publications & Welfare', NULL, 4),
(10, 'Examinations & Registration', NULL, 9),
(11, 'Engineering Division', NULL, 10),
(12, 'Finance Division', NULL, 4),
(13, 'The Library', NULL, 2),
(14, 'External Degrees Centre (EDC)', NULL, 5),
(15, 'Network Operations Centre', NULL, 6);


COMMIT;
