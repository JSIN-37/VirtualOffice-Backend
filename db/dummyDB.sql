START TRANSACTION;


INSERT INTO `vo_user` (`id`, `first_name`, `last_name`, `email`, `contact_number`, `password`, `dob`, `gender`, `address`, `division_id`) VALUES
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
(2, 'General Administration', 'The  General Administration Division is responsible for matters relating to the rehabilitation works, maintenance of buildings and equipment, providing services to the staff and students, procurement and communication facilities.', 1),
(3, 'Academic & Publications', 'The Academic & Publications Division is responsible for procedures related to matters such as publications by the academic establishment, the collection of data and the compilation of University statistics, as well as registration related proceedings of several postgraduate programs of the University', 2),
(4, 'Examinations & Registration', 'Examinations & Registration Division provides various important student related services such as Student Registration, Undergraduate and Postgraduate Examinations Related Activities, Conducting Aptitude Tests, Issuing Examination Results, Issuing Academic Transcripts and Degree Certificates etc.', 3),
(5, 'Establishments', 'Establishments Division is the recruitment of qualified staff and retaining them in the service in line with the corporate goals of the University. The Establishments Division also assists the University Council in the development, maintenance and interpretation of human resources management procedures in accordance with the Establishment Code and Rule and Regulations of the University Grants Commission and Administrative policies of the University.', 4),
(6, 'Postgraduate & Quality Assurance', 'The Postgraduate Studies Division was set up under the Dean of each Faculty for the administration of Research Degrees in the Faculty.\r\n\r\nIt is headed by the Director of Postgraduate Studies, who is also the ex-officio Chairman of the Higher Degrees Committee of each Faculty.', 8),
(7, 'External Degrees Centre', 'External Degrees and Extension Course Unit of University is offering six degrees from two majors from Faculty of Management Studies and Commerce and Faculty of Humanities and Social Sciences. ', 6),
(8, 'Director’s Office', 'Director’s office is where the Director functions as the Principal Executive Officer as well as the Principal Academic Officer in the University.  And takes care of both academic and non-academic activities for the smooth functioning of the University.', 7),
(9, 'Academic, Publications & Welfare', 'The Student & Staff Welfare office is responsible for the welfare of all students enrolled at the University. It works closely with all administrative and academic departments to assist students to familiarize the environment and achieve their academic goals as well as assist students with the culture and the community. The mission of the division is to provide an enabling environment that aims at quality student services and a range of learning, social, cultural, health, and recreational opport', 4),
(10, 'Examinations & Registration', 'Examinations & Registration Division provides various important student related services such as Student Registration, Undergraduate and Postgraduate Examinations Related Activities, Conducting Aptitude Tests, Issuing Examination Results, Issuing Academic Transcripts and Degree Certificates etc.', 9),
(11, 'Engineering Division', 'Pursuing fundamental electrical, electronic and photonic research at the material, device and system levels with a focus on creating integrated solutions in the fields of nanotechnology, sensing, energy generation, energy conversion, displays and communications.', 10),
(12, 'Finance Division', 'The Division is headed by a Bursar, 02 Deputy Bursars, 01 Senior Assistant Bursar, along with a staff consisting of 05 Book Keepers, 01 Data Administrator, 02 Computer Applications Assistants, 12 Clerks, 02 Shroffs 01 Book Binder, 03 Laborers. \r\nThe primary objective of the Finance Division is to plan, organize, direct and control financial activities such as procurement and the proper utilization of funds efficiently and effectively to meet the goals and objectives in line with the strategic pl', 4),
(13, 'The Library', 'The University library system consists of the Central Library and faculty libraries. \r\nThe Central Library is situated in a five storied building between the Law Faculty Building Complex and the Arts Faculty Building Complex. The library contains books and periodicals in Humanities, Education, Law, Management, and Social Sciences. The main entrance to the library is facing the Reid Avenue.\r\n', 2),
(14, 'External Degrees Centre (EDC)', 'The external degree centre offers degrees to university students who have not means to be physically present within the geographic territory of the institution.', 5),
(15, 'Network Operations Centre', 'A network operations center (NOC) is a centralized location where IT teams can continuously monitor the performance and health of a network. The NOC serves as the first line of defense against network disruptions and failures.\r\n\r\n', 6);


INSERT INTO `vo_worklog` (`id`, `user_id`, `start_date`, `start_time`, `end_time`, `start_location`, `end_location`, `location_offset`, `full_half`) VALUES
(1, 9, '2021-09-19', 1613099469, 1613133662, 'Nugegoda', 'Nugegoda', 0, NULL),
(2, 1, '2021-01-11', 1610332822, 1610376753, 'Matara', 'Galle', 1, NULL),
(3, 1, '2021-01-19', 1611019801, 1611056501, 'Battaramulla', 'Battaramulla', 0, 'F'),
(4, 1, '2021-06-30', 1625017332, 1625020812, 'Galle', 'Galle', 0, 'N'),
(5, 2, '2021-03-02', 1614645692, 1614682292, 'Gampaha', 'Nugegoda', 1, 'F'),
(6, 2, '2021-05-11', 1620700832, 1620693632, 'Gampaha', 'Gampaha', 0, 'F'),
(7, 3, '2021-08-15', 1628995192, 1629030660, 'Kandy', 'Kandy', 0, 'F'),
(8, 3, '2021-01-29', 1611895931, 1611928932, 'Gampola', 'Gampola', 0, 'H'),
(9, 4, '2021-09-19', 1632013295, 1632063732, 'Battaramulla', 'Nugegoda', 1, 'F'),
(10, 4, '2021-04-10', 1618022532, 1618062762, 'Nugegoda', 'Nugegoda', 0, 'F');


COMMIT;
