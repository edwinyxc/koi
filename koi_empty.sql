-- MySQL dump 10.13  Distrib 5.5.37, for Win64 (x86)
--
-- Host: localhost    Database: koi
-- ------------------------------------------------------
-- Server version	5.5.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `r_process_instance_element`
--

DROP TABLE IF EXISTS `r_process_instance_element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_process_instance_element` (
  `process_instance` varchar(64) DEFAULT NULL,
  `element` varchar(64) DEFAULT NULL,
  `state` int(2) DEFAULT NULL COMMENT '0 -unhandled 1 -waiting for complete 9 -closed',
  UNIQUE KEY `process_instance` (`process_instance`,`element`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `r_process_instance_element`
--

LOCK TABLES `r_process_instance_element` WRITE;
/*!40000 ALTER TABLE `r_process_instance_element` DISABLE KEYS */;
/*!40000 ALTER TABLE `r_process_instance_element` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `r_process_instance_property`
--

DROP TABLE IF EXISTS `r_process_instance_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_process_instance_property` (
  `process_instance` varchar(64) DEFAULT NULL,
  `property` varchar(64) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  UNIQUE KEY `process_instance` (`process_instance`,`property`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `r_process_instance_property`
--

LOCK TABLES `r_process_instance_property` WRITE;
/*!40000 ALTER TABLE `r_process_instance_property` DISABLE KEYS */;
/*!40000 ALTER TABLE `r_process_instance_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `r_process_instance_transition`
--

DROP TABLE IF EXISTS `r_process_instance_transition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `r_process_instance_transition` (
  `process_instance` varchar(64) DEFAULT NULL,
  `result` varchar(255) DEFAULT NULL COMMENT 'result of condition',
  `transition` varchar(64) DEFAULT NULL,
  UNIQUE KEY `process_instance` (`process_instance`,`transition`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `r_process_instance_transition`
--

LOCK TABLES `r_process_instance_transition` WRITE;
/*!40000 ALTER TABLE `r_process_instance_transition` DISABLE KEYS */;
/*!40000 ALTER TABLE `r_process_instance_transition` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_element`
--

DROP TABLE IF EXISTS `t_element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_element` (
  `id` varchar(64) NOT NULL,
  `x` int(11) DEFAULT NULL,
  `y` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `process` varchar(64) DEFAULT NULL,
  `act_url` varchar(2048) DEFAULT NULL,
  `act_method` varchar(6) DEFAULT NULL,
  `act_params` varchar(4096) DEFAULT NULL,
  `syn_strategy` varchar(3) DEFAULT 'any' COMMENT 'any or all',
  `type` char(1) DEFAULT NULL COMMENT 'a for activity and s for synchronizer',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_element`
--

LOCK TABLES `t_element` WRITE;
/*!40000 ALTER TABLE `t_element` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_element` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_log`
--

DROP TABLE IF EXISTS `t_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_log` (
  `id` varchar(64) NOT NULL,
  `process_instance` varchar(64) DEFAULT NULL,
  `author` varchar(64) DEFAULT NULL,
  `time` bigint(20) DEFAULT NULL,
  `log` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_log`
--

LOCK TABLES `t_log` WRITE;
/*!40000 ALTER TABLE `t_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_process`
--

DROP TABLE IF EXISTS `t_process`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_process` (
  `id` varchar(64) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_process`
--

LOCK TABLES `t_process` WRITE;
/*!40000 ALTER TABLE `t_process` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_process` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_process_instance`
--

DROP TABLE IF EXISTS `t_process_instance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_process_instance` (
  `id` varchar(64) NOT NULL,
  `state` int(2) DEFAULT '0' COMMENT '0 -not started, 1 -working, 8-aborted, 9-finished ',
  `name` varchar(50) DEFAULT NULL,
  `process` varchar(64) DEFAULT NULL,
  `addresser` varchar(64) DEFAULT NULL COMMENT 'who starts the process.',
  `start_time` bigint(20) DEFAULT NULL,
  `end_time` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_process_instance`
--

LOCK TABLES `t_process_instance` WRITE;
/*!40000 ALTER TABLE `t_process_instance` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_process_instance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_property`
--

DROP TABLE IF EXISTS `t_property`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_property` (
  `id` varchar(64) NOT NULL,
  `name` varchar(50) NOT NULL,
  `value` varchar(255) DEFAULT NULL COMMENT 'default value',
  `process` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `process` (`process`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_property`
--

LOCK TABLES `t_property` WRITE;
/*!40000 ALTER TABLE `t_property` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_property` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `t_transition`
--

DROP TABLE IF EXISTS `t_transition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `t_transition` (
  `id` varchar(64) NOT NULL,
  `from` varchar(64) NOT NULL COMMENT 'from element',
  `to` varchar(64) NOT NULL COMMENT 'to element',
  `condition` varchar(1000) DEFAULT NULL,
  `name` varchar(50) DEFAULT '',
  `process` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `process` (`process`,`from`,`to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `t_transition`
--

LOCK TABLES `t_transition` WRITE;
/*!40000 ALTER TABLE `t_transition` DISABLE KEYS */;
/*!40000 ALTER TABLE `t_transition` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-12-15 17:17:57
