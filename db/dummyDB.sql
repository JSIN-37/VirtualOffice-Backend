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
(25, 'Naushikha', 'Realo', 'naushikha.jayawickrama@gmail.com', '0768333893', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-08-16', 'M', '14/2, Rail way road, Nugegoda', 3),
(26, 'Imashi', 'Realo', 'imashi921a@gmail.com', '0768333893', '3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1eb8b85103e3be7ba613b31bb5c9c36214dc9f14a42fd7a2fdb84856bca5c44c2', '1998-08-16', 'F', '14/2, Rail way road, Nugegoda', 3);


INSERT INTO `vo_division` (`id`, `name`, `description`, `hod_id`) VALUES
(2, 'General Administration', 'The  General Administration Division is responsible for matters relating to the rehabilitation works, maintenance of buildings and equipment, providing services to the staff and students.', 1),
(3, 'Academic & Publications', 'The Academic & Publications Division is responsible for procedures related to matters such as publications by the academic establishment, and the compilation of University statistics.', 2),
(4, 'Examinations & Registration', 'Examinations & Registration Division provides various important student related services such as Student Registration, Undergraduate and Postgraduate Examinations Related Activities, Conducting Aptitude Tests, Issuing Examination Results, Issuing Academic Transcripts and Degree Certificates etc.', 3),
(5, 'Establishments', 'Establishments Division is the recruitment of qualified staff and retaining them in the service in line with the corporate goals of the University. The Establishments Division also assists the University Council in the development, maintenance and interpretation of human resources management procedures.', 4),
(6, 'Postgraduate & Quality Assurance', 'The Postgraduate Studies and Quality Assurance Division was set up under the Dean of each Faculty for the administration of Research Degrees in the Faculty. It is headed by the Director of Postgraduate Studies, who is also the ex-official Chairman of the Higher Degrees and Quality Assurance Committee of each Faculty.', 8),
(7, 'External Degrees Centre', 'External Degrees and Extension Course Unit of University is offering six degrees from two majors from Faculty of Management Studies and Commerce and Faculty of Humanities and Social Sciences.', 6),
(8, 'Director’s Office', 'Director’s office is where the Director functions as the Principal Executive Officer as well as the Principal Academic Officer in the University.  And takes care of both academic and non-academic activities.', 7),
(9, 'Academic, Publications & Welfare', 'The Student & Staff Welfare is working with administrative and academic departments to assist students to familiarize themselves with the environment and to help them achieve their academic goals.', 4),
(11, 'Engineering Division', 'Pursuing fundamental electrical, electronic and photonic research at the material, device and system levels with a focus on creating integrated solutions in the fields of nanotechnology, sensing, energy generation, energy conversion, displays and communications.', 10),
(12, 'Finance Division', 'The primary objective of the Finance Division is to plan, organize, direct and control financial activities such as procurement and the proper utilization of funds efficiently and effectively to meet the goals and objectives in line with the strategic plan.', 4),
(13, 'The Library', 'The University library system consists of the Central Library and faculty libraries. The Central Library is situated in a five storied building between the Law Faculty Building Complex and the Arts Faculty Building Complex. The library contains books and periodicals in Humanities.', 2),
(14, 'External Degrees Centre (EDC)', 'The external degree centre offers degrees to university students who have not means to be physically present within the geographic territory of the institution.', 5),
(15, 'Network Operations Centre', 'NOC is a centralized location where IT teams continuously monitor the performance and health of networks. It serves as the first line defense against network failures.', 6);


INSERT INTO `vo_worklog` (`id`, `user_id`, `start_date`, `start_time`, `end_time`, `start_location`, `end_location`, `location_offset`, `full_half`) VALUES
(2, 1, '2021-09-01', 1610332822, 1610376753, 'https://goo.gl/maps/HneHSzxAV7rJ6AeX7', 'https://goo.gl/maps/nzQa2SZmkqgziofSA', 1, 'F'),
(3, 1, '2021-09-02', 1611019801, 1611056501, 'https://goo.gl/maps/TmhyGXvaBYCVa7uU9', 'https://goo.gl/maps/TmhyGXvaBYCVa7uU9', 0, 'F'),
(4, 1, '2021-09-03', 1625017332, 1625020812, 'https://goo.gl/maps/HB4b1kUZFCZKwwWX7', 'https://goo.gl/maps/HB4b1kUZFCZKwwWX7', 0, 'N'),
(5, 2, '2022-09-01', 1614645692, 1614682292, 'https://goo.gl/maps/GDoLYSb8Z3mig7uP8', 'https://goo.gl/maps/3vgxkk833Yevb5SEA', 1, 'F'),
(6, 2, '2021-09-02', 1620700832, 1620693632, 'https://goo.gl/maps/HB4b1kUZFCZKwwWX7', 'https://goo.gl/maps/HB4b1kUZFCZKwwWX7', 0, 'F'),
(7, 3, '2021-09-01', 1628995192, 1629030660, 'https://goo.gl/maps/TmhyGXvaBYCVa7uU9', 'https://goo.gl/maps/TmhyGXvaBYCVa7uU9', 0, 'F'),
(8, 3, '2021-09-02', 1611895931, 1611928932, 'https://goo.gl/maps/nzQa2SZmkqgziofSA', 'https://goo.gl/maps/nzQa2SZmkqgziofSA', 0, 'H'),
(9, 4, '2021-09-03', 1632013295, 1632063732, 'https://goo.gl/maps/oymzQMHpBprB82257', 'https://goo.gl/maps/dJeNz6DTArZNv5iAA', 1, 'F'),
(10, 4, '2021-09-06', 1618022532, 1618062762, 'https://goo.gl/maps/dJeNz6DTArZNv5iAA', 'https://goo.gl/maps/dJeNz6DTArZNv5iAA', 0, 'F'),
(11, 1, '2021-09-06', 1620700832, 1618062762, 'https://goo.gl/maps/bWfoaEG4arGdWkJD7', 'https://goo.gl/maps/bWfoaEG4arGdWkJD7', 0, 'F'),
(13, 2, '2021-09-06', 1620700832, 1632111589, 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 0, 'F'),
(14, 3, '2021-09-06', 1620700832, 1618062762, 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 0, 'F'),
(15, 4, '2021-09-20', 1611895931, 1618062762, 'https://goo.gl/maps/RdvG5c1uNDUEbAC88', 'https://goo.gl/maps/QpG2PgXovCB4sfzo8', 1, 'F'),
(19, 3, '2021-09-20', 1611019801, 1611056501, 'https://goo.gl/maps/sda5NX1EAmY34WsXA', 'https://goo.gl/maps/sda5NX1EAmY34WsXA', 0, 'F'),
(20, 2, '2021-09-20', 1620700832, 1611056501, 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 'https://goo.gl/maps/54Z1Vq7tAe7jQF5u8', 0, 'F'),
(21, 1, '2021-09-20', 1611895931, 1632137279, 'https://goo.gl/maps/x4Hg4dqQ4153fuK8A', 'https://goo.gl/maps/x4Hg4dqQ4153fuK8A', 0, 'F'),
(22, 5, '2021-09-20', 1625017332, 1632126479, 'https://goo.gl/maps/uhN8gs6yRRwyQeuB9', 'https://goo.gl/maps/uhN8gs6yRRwyQeuB9', 0, 'H');


COMMIT;
