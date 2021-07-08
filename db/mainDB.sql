-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 08, 2021 at 04:17 PM
-- Server version: 10.4.16-MariaDB
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `VO`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) PRIMARY KEY,
  `first_name` varchar(255),
  `last_name` varchar(255),
  `email` varchar(255),
  `contact_number` char(10),
  `password` varchar(255),
  `dob` date,
  `gender` char(1),
  `address` varchar(400)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `first_name`, `last_name`, `email`, `contact_number`, `password`, `dob`, `gender`, `address`) VALUES
(0, 'Admin', '', 'admin@vo.com', '0000000000', '123', '2021-09-09', 'A', 'VirtualOffice'),
(1, 'Naushikha', 'Jayawickrama', 'naushikha@outlook.com', '0763316991', '123', '1997-09-09', 'M', 'School Lane, Kadawatha.'),
(2, 'Imashi', 'Dissanayake', 'imashi921a@gmail.com', '0703081775', '123', '1997-09-21', 'F', 'Armpitiya, Kandy.'),
(3, 'mamaaaa', 'Oooooooohohohh', 'stuff', '01234', 'pass', '2020-11-01', 'M', '19');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;