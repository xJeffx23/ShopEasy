CREATE DATABASE  IF NOT EXISTS `newtech_db` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `newtech_db`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: newtech_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `canton`
--

DROP TABLE IF EXISTS `canton`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `canton` (
  `id_Canton` int NOT NULL AUTO_INCREMENT,
  `Nombre_Canton` varchar(45) NOT NULL,
  `Provincia_idProvincia` int NOT NULL,
  PRIMARY KEY (`id_Canton`),
  KEY `fk_Canton_Provincia1_idx` (`Provincia_idProvincia`),
  CONSTRAINT `fk_Canton_Provincia1` FOREIGN KEY (`Provincia_idProvincia`) REFERENCES `provincia` (`idProvincia`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `canton`
--

LOCK TABLES `canton` WRITE;
/*!40000 ALTER TABLE `canton` DISABLE KEYS */;
INSERT INTO `canton` VALUES (1,'San José',1),(2,'Escazú',1),(3,'Desamparados',1),(4,'Puriscal',1),(5,'Tarrazú',1),(6,'Aserrí',1),(7,'Mora',1),(8,'Goicoechea',1),(9,'Santa Ana',1),(10,'Alajuelita',1),(11,'Vásquez de Coronado',1),(12,'Acosta',1),(13,'Tibás',1),(14,'Moravia',1),(15,'Montes de Oca',1),(16,'Turrubares',1),(17,'Dota',1),(18,'Curridabat',1),(19,'Pérez Zeledón',1),(20,'León Cortés Castro',1),(21,'Alajuela',2),(22,'San Ramón',2),(23,'Grecia',2),(24,'San Mateo',2),(25,'Atenas',2),(26,'Naranjo',2),(27,'Palmares',2),(28,'Poás',2),(29,'Orotina',2),(30,'San Carlos',2),(31,'Zarcero',2),(32,'Sarchí',2),(33,'Upala',2),(34,'Los Chiles',2),(35,'Guatuso',2),(36,'Río Cuarto',2),(37,'Cartago',3),(38,'Paraíso',3),(39,'La Unión',3),(40,'Jiménez',3),(41,'Turrialba',3),(42,'Alvarado',3),(43,'Oreamuno',3),(44,'El Guarco',3),(45,'Heredia',4),(46,'Barva',4),(47,'Santo Domingo',4),(48,'Santa Bárbara',4),(49,'San Rafael',4),(50,'San Isidro',4),(51,'Belén',4),(52,'Flores',4),(53,'San Pablo',4),(54,'Sarapiquí',4),(55,'Liberia',5),(56,'Nicoya',5),(57,'Santa Cruz',5),(58,'Bagaces',5),(59,'Carrillo',5),(60,'Cañas',5),(61,'Abangares',5),(62,'Tilarán',5),(63,'Nandayure',5),(64,'La Cruz',5),(65,'Hojancha',5),(66,'Puntarenas',6),(67,'Esparza',6),(68,'Buenos Aires',6),(69,'Montes de Oro',6),(70,'Osa',6),(71,'Quepos',6),(72,'Golfito',6),(73,'Coto Brus',6),(74,'Parrita',6),(75,'Corredores',6),(76,'Garabito',6),(77,'Limón',7),(78,'Pococí',7),(79,'Siquirres',7),(80,'Talamanca',7),(81,'Matina',7),(82,'Guácimo',7);
/*!40000 ALTER TABLE `canton` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_cliente`
--

DROP TABLE IF EXISTS `catalogo_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_cliente` (
  `idCatalogo_Cliente` int NOT NULL AUTO_INCREMENT,
  `Descripcion_Catalogo_Cliente` varchar(45) NOT NULL,
  `Descuento` decimal(5,2) NOT NULL,
  PRIMARY KEY (`idCatalogo_Cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_cliente`
--

LOCK TABLES `catalogo_cliente` WRITE;
/*!40000 ALTER TABLE `catalogo_cliente` DISABLE KEYS */;
INSERT INTO `catalogo_cliente` VALUES (1,'Regular',0.00),(2,'VIP',10.00);
/*!40000 ALTER TABLE `catalogo_cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_estado_envio`
--

DROP TABLE IF EXISTS `catalogo_estado_envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_estado_envio` (
  `idCatalogo_Estado_Envio` int NOT NULL AUTO_INCREMENT,
  `Descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_Estado_Envio`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_estado_envio`
--

LOCK TABLES `catalogo_estado_envio` WRITE;
/*!40000 ALTER TABLE `catalogo_estado_envio` DISABLE KEYS */;
INSERT INTO `catalogo_estado_envio` VALUES (1,'En Bodega'),(2,'En Ruta'),(3,'Entregado');
/*!40000 ALTER TABLE `catalogo_estado_envio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_estado_pago`
--

DROP TABLE IF EXISTS `catalogo_estado_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_estado_pago` (
  `idCatalogo_estado_pago` int NOT NULL AUTO_INCREMENT,
  `Descripcion_Catalogo_estado_pago` varchar(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_estado_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_estado_pago`
--

LOCK TABLES `catalogo_estado_pago` WRITE;
/*!40000 ALTER TABLE `catalogo_estado_pago` DISABLE KEYS */;
INSERT INTO `catalogo_estado_pago` VALUES (1,'Pagado'),(2,'Pendiente');
/*!40000 ALTER TABLE `catalogo_estado_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_estado_pedido`
--

DROP TABLE IF EXISTS `catalogo_estado_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_estado_pedido` (
  `idCatalogo_estado_Pedido` int NOT NULL AUTO_INCREMENT,
  `Activo` bit(1) NOT NULL,
  `Descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_estado_Pedido`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_estado_pedido`
--

LOCK TABLES `catalogo_estado_pedido` WRITE;
/*!40000 ALTER TABLE `catalogo_estado_pedido` DISABLE KEYS */;
INSERT INTO `catalogo_estado_pedido` VALUES (1,_binary '','Procesando'),(2,_binary '','Enviado'),(3,_binary '','Entregado');
/*!40000 ALTER TABLE `catalogo_estado_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_estado_stock`
--

DROP TABLE IF EXISTS `catalogo_estado_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_estado_stock` (
  `idCatalogo_estado_stock` int NOT NULL AUTO_INCREMENT,
  `Activo` bit(1) NOT NULL,
  `Descripcion_Estado_stock` varchar(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_estado_stock`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_estado_stock`
--

LOCK TABLES `catalogo_estado_stock` WRITE;
/*!40000 ALTER TABLE `catalogo_estado_stock` DISABLE KEYS */;
INSERT INTO `catalogo_estado_stock` VALUES (1,_binary '','Disponible'),(2,_binary '','Agotado');
/*!40000 ALTER TABLE `catalogo_estado_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_genero`
--

DROP TABLE IF EXISTS `catalogo_genero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_genero` (
  `idCatalogo_Genero` int NOT NULL AUTO_INCREMENT,
  `Descripcion_Genero` varchar(45) NOT NULL,
  PRIMARY KEY (`idCatalogo_Genero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_genero`
--

LOCK TABLES `catalogo_genero` WRITE;
/*!40000 ALTER TABLE `catalogo_genero` DISABLE KEYS */;
INSERT INTO `catalogo_genero` VALUES (1,'Masculino'),(2,'Femenino'),(3,'Otro');
/*!40000 ALTER TABLE `catalogo_genero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_metodo_pago`
--

DROP TABLE IF EXISTS `catalogo_metodo_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_metodo_pago` (
  `idCatalogo_metodo_pago` int NOT NULL AUTO_INCREMENT,
  `Descripcion_metodo_pago` varchar(45) NOT NULL,
  `Activo` bit(1) NOT NULL,
  PRIMARY KEY (`idCatalogo_metodo_pago`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_metodo_pago`
--

LOCK TABLES `catalogo_metodo_pago` WRITE;
/*!40000 ALTER TABLE `catalogo_metodo_pago` DISABLE KEYS */;
INSERT INTO `catalogo_metodo_pago` VALUES (1,'Tarjeta Crédito',_binary ''),(2,'Efectivo',_binary '');
/*!40000 ALTER TABLE `catalogo_metodo_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_telefono_estado`
--

DROP TABLE IF EXISTS `catalogo_telefono_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalogo_telefono_estado` (
  `id_Catalogo_Telefono_estado` int NOT NULL AUTO_INCREMENT,
  `Activo` bit(1) NOT NULL,
  `Descripcion_Catalogo_Telefono` varchar(45) NOT NULL,
  PRIMARY KEY (`id_Catalogo_Telefono_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_telefono_estado`
--

LOCK TABLES `catalogo_telefono_estado` WRITE;
/*!40000 ALTER TABLE `catalogo_telefono_estado` DISABLE KEYS */;
INSERT INTO `catalogo_telefono_estado` VALUES (1,_binary '','Celular'),(2,_binary '','Casa');
/*!40000 ALTER TABLE `catalogo_telefono_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_Cliente` int NOT NULL AUTO_INCREMENT,
  `Activo` bit(1) NOT NULL,
  `Fecha_Registro` datetime NOT NULL,
  `Catalogo_Cliente_idCatalogo_Cliente` int NOT NULL,
  `Persona_id_Persona1` int NOT NULL,
  PRIMARY KEY (`id_Cliente`),
  KEY `fk_Cliente_Catalogo_Cliente1_idx` (`Catalogo_Cliente_idCatalogo_Cliente`),
  KEY `fk_Cliente_Persona1_idx` (`Persona_id_Persona1`),
  CONSTRAINT `fk_Cliente_Catalogo_Cliente1` FOREIGN KEY (`Catalogo_Cliente_idCatalogo_Cliente`) REFERENCES `catalogo_cliente` (`idCatalogo_Cliente`),
  CONSTRAINT `fk_Cliente_Persona1` FOREIGN KEY (`Persona_id_Persona1`) REFERENCES `persona` (`id_Persona`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,_binary '','2026-02-24 18:58:43',1,1),(2,_binary '','2026-02-24 19:04:49',2,2);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `idDireccion` int NOT NULL AUTO_INCREMENT,
  `Otras_señas` varchar(500) NOT NULL,
  `Tipo_Direccion_idTipo_Direccion` int NOT NULL,
  `Persona_id_Persona` int NOT NULL,
  `Distrito_idDistrito` int NOT NULL,
  PRIMARY KEY (`idDireccion`),
  KEY `fk_Direccion_Tipo_Direccion1_idx` (`Tipo_Direccion_idTipo_Direccion`),
  KEY `fk_Direccion_Persona1_idx` (`Persona_id_Persona`),
  KEY `fk_Direccion_Distrito1_idx` (`Distrito_idDistrito`),
  CONSTRAINT `fk_Direccion_Distrito1` FOREIGN KEY (`Distrito_idDistrito`) REFERENCES `distrito` (`idDistrito`),
  CONSTRAINT `fk_Direccion_Persona1` FOREIGN KEY (`Persona_id_Persona`) REFERENCES `persona` (`id_Persona`),
  CONSTRAINT `fk_Direccion_Tipo_Direccion1` FOREIGN KEY (`Tipo_Direccion_idTipo_Direccion`) REFERENCES `tipo_direccion` (`idTipo_Direccion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'100m norte del parque central',1,1,1),(2,'200m sur del banco',2,2,5);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `distrito`
--

DROP TABLE IF EXISTS `distrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `distrito` (
  `idDistrito` int NOT NULL AUTO_INCREMENT,
  `Nombre_Distrito` varchar(45) NOT NULL,
  `Codigo_Postal` varchar(10) NOT NULL,
  `Canton_id_Canton` int NOT NULL,
  PRIMARY KEY (`idDistrito`),
  KEY `fk_Distrito_Canton1_idx` (`Canton_id_Canton`),
  CONSTRAINT `fk_Distrito_Canton1` FOREIGN KEY (`Canton_id_Canton`) REFERENCES `canton` (`id_Canton`)
) ENGINE=InnoDB AUTO_INCREMENT=494 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `distrito`
--

LOCK TABLES `distrito` WRITE;
/*!40000 ALTER TABLE `distrito` DISABLE KEYS */;
INSERT INTO `distrito` VALUES (1,'Carmen','10101',1),(2,'Merced','10102',1),(3,'Hospital','10103',1),(4,'Catedral','10104',1),(5,'Zapote','10105',1),(6,'San Francisco de Dos Ríos','10106',1),(7,'Uruca','10107',1),(8,'Mata Redonda','10108',1),(9,'Pavas','10109',1),(10,'Hatillo','10110',1),(11,'San Sebastián','10111',1),(12,'Escazú','10201',2),(13,'San Antonio','10202',2),(14,'San Rafael','10203',2),(15,'Desamparados','10301',3),(16,'San Miguel','10302',3),(17,'San Juan de Dios','10303',3),(18,'San Rafael Arriba','10304',3),(19,'San Antonio','10305',3),(20,'Frailes','10306',3),(21,'Patarrá','10307',3),(22,'San Cristóbal','10308',3),(23,'Rosario','10309',3),(24,'Damas','10310',3),(25,'San Rafael Abajo','10311',3),(26,'Gravilias','10312',3),(27,'Los Guido','10313',3),(28,'Santiago','10401',4),(29,'Mercedes Sur','10402',4),(30,'Barbacoas','10403',4),(31,'Grifo Alto','10404',4),(32,'San Rafael','10405',4),(33,'Candelarita','10406',4),(34,'Desamparaditos','10407',4),(35,'San Antonio','10408',4),(36,'Choi','10409',4),(37,'Zhico','10410',4),(38,'San Marcos','10501',5),(39,'San Lorenzo','10502',5),(40,'San Carlos','10503',5),(41,'Aserrí','10601',6),(42,'Tarbaca','10602',6),(43,'Vuelta de Jorco','10603',6),(44,'San Gabriel','10604',6),(45,'La Legua','10605',6),(46,'Monterrey','10606',6),(47,'Salitrillos','10607',6),(48,'Colón','10701',7),(49,'Guayabo','10702',7),(50,'Tabarcia','10703',7),(51,'Piedras Negras','10704',7),(52,'Picagres','10705',7),(53,'Jaris','10706',7),(54,'Quitirrisí','10707',7),(55,'Guadalupe','10801',8),(56,'San Francisco','10802',8),(57,'Calle Blancos','10803',8),(58,'Mata de Plátano','10804',8),(59,'Ipís','10805',8),(60,'Rancho Redondo','10806',8),(61,'Purral','10807',8),(62,'Santa Ana','10901',9),(63,'Salitral','10902',9),(64,'Pozos','10903',9),(65,'Uruca','10904',9),(66,'Piedades','10905',9),(67,'Brasil','10906',9),(68,'Alajuelita','11001',10),(69,'San Josecito','11002',10),(70,'San Antonio','11003',10),(71,'Concepción','11004',10),(72,'San Felipe','11005',10),(73,'San Isidro','11101',11),(74,'San Rafael','11102',11),(75,'Dulce Nombre de Jesús','11103',11),(76,'Patalillo','11104',11),(77,'Cascajal','11105',11),(78,'San Ignacio','11201',12),(79,'Guaitil','11202',12),(80,'Palmichal','11203',12),(81,'Cangrejal','11204',12),(82,'Sabanillas','11205',12),(83,'San Juan','11301',13),(84,'Cinco Esquinas','11302',13),(85,'Anselmo Llorente','11303',13),(86,'León XIII','11304',13),(87,'Colima','11305',13),(88,'San Vicente','11401',14),(89,'San Jerónimo','11402',14),(90,'La Trinidad','11403',14),(91,'San Pedro','11501',15),(92,'Sabanilla','11502',15),(93,'Mercedes','11503',15),(94,'San Rafael','11504',15),(95,'San Pablo','11601',16),(96,'San Pedro','11602',16),(97,'San Juan de Mata','11603',16),(98,'San Luis','11604',16),(99,'Carara','11605',16),(100,'Santa María','11701',17),(101,'Jardín','11702',17),(102,'Copey','11703',17),(103,'Curridabat','11801',18),(104,'Granadilla','11802',18),(105,'Sánchez','11803',18),(106,'Tirrases','11804',18),(107,'San Isidro de El General','11901',19),(108,'El General','11902',19),(109,'Daniel Flores','11903',19),(110,'Rivas','11904',19),(111,'San Pedro','11905',19),(112,'Platanares','11906',19),(113,'Pejibaye','11907',19),(114,'Cajón','11908',19),(115,'Barú','11909',19),(116,'Río Nuevo','11910',19),(117,'Páramo','11911',19),(118,'La Amistad','11912',19),(119,'San Pablo','12001',20),(120,'San Andrés','12002',20),(121,'Llano Bonito','12003',20),(122,'San Isidro','12004',20),(123,'Santa Cruz','12005',20),(124,'San Antonio','12006',20),(125,'Alajuela','20101',21),(126,'San José','20102',21),(127,'Carrizal','20103',21),(128,'San Antonio','20104',21),(129,'Guácimo','20105',21),(130,'San Isidro','20106',21),(131,'Sarapiquí','20107',21),(132,'San Rafael','20108',21),(133,'Río Segundo','20109',21),(134,'Desamparados','20110',21),(135,'Turrúcares','20111',21),(136,'Tambor','20112',21),(137,'Garita','20113',21),(138,'Sabanilla','20114',21),(139,'San Ramón','20201',22),(140,'Santiago','20202',22),(141,'San Juan','20203',22),(142,'Piedades Norte','20204',22),(143,'Piedades Sur','20205',22),(144,'San Rafael','20206',22),(145,'San Isidro','20207',22),(146,'Ángeles','20208',22),(147,'Alfaro','20209',22),(148,'Volio','20210',22),(149,'Concepción','20211',22),(150,'Zapotal','20212',22),(151,'Peñas Blancas','20213',22),(152,'San Lorenzo','20214',22),(153,'Grecia','20301',23),(154,'San Isidro','20302',23),(155,'San José','20303',23),(156,'San Roque','20304',23),(157,'Tacares','20305',23),(158,'Río Cuarto','20306',23),(159,'Puente de Piedra','20307',23),(160,'Bolívar','20308',23),(161,'San Mateo','20401',24),(162,'Desmonte','20402',24),(163,'Jesús María','20403',24),(164,'Labrador','20404',24),(165,'Atenas','20501',25),(166,'Jesús','20502',25),(167,'Mercedes','20503',25),(168,'San Isidro','20504',25),(169,'Concepción','20505',25),(170,'San José','20506',25),(171,'Santa Eulalia','20507',25),(172,'Escobal','20508',25),(173,'Naranjo','20601',26),(174,'San Miguel','20602',26),(175,'San José','20603',26),(176,'Cirrí Sur','20604',26),(177,'San Jerónimo','20605',26),(178,'San Juan','20606',26),(179,'El Rosario','20607',26),(180,'Palmitos','20608',26),(181,'Palmares','20701',27),(182,'Zaragoza','20702',27),(183,'Buenos Aires','20703',27),(184,'Santiago','20704',27),(185,'Candelaria','20705',27),(186,'Esquipulas','20706',27),(187,'La Granja','20707',27),(188,'San Pedro','20801',28),(189,'San Juan','20802',28),(190,'San Rafael','20803',28),(191,'Carrillos','20804',28),(192,'Sabana Redonda','20805',28),(193,'Orotina','20901',29),(194,'El Mastate','20902',29),(195,'Hacienda Vieja','20903',29),(196,'Coyolar','20904',29),(197,'La Ceiba','20905',29),(198,'Ciudad Quesada','21001',30),(199,'Florencia','21002',30),(200,'Buenavista','21003',30),(201,'Aguas Zarcas','21004',30),(202,'Venecia','21005',30),(203,'Pital','21006',30),(204,'La Fortuna','21007',30),(205,'La Tigra','21008',30),(206,'La Palmera','21009',30),(207,'Venado','21010',30),(208,'Cutris','21011',30),(209,'Monterrey','21012',30),(210,'Pocosol','21013',30),(211,'Zarcero','21101',31),(212,'Laguna','21102',31),(213,'Tapesco','21103',31),(214,'Guadalupe','21104',31),(215,'Palmira','21105',31),(216,'Zapote','21106',31),(217,'Brisas','21107',31),(218,'Sarchí Norte','21201',32),(219,'Sarchí Sur','21202',32),(220,'Toro Amarillo','21203',32),(221,'San Pedro','21204',32),(222,'Rodríguez','21205',32),(223,'Upala','21301',33),(224,'Aguas Claras','21302',33),(225,'San José o Pizote','21303',33),(226,'Bijagua','21304',33),(227,'Delicias','21305',33),(228,'Dos Ríos','21306',33),(229,'Yolillal','21307',33),(230,'Canalete','21308',33),(231,'Los Chiles','21401',34),(232,'Caño Negro','21402',34),(233,'El Amparo','21403',34),(234,'San Jorge','21404',34),(235,'San Rafael','21501',35),(236,'Buenavista','21502',35),(237,'Cote','21503',35),(238,'Katira','21504',35),(239,'Río Cuarto','21601',36),(240,'Santa Rita','21602',36),(241,'Santa Isabel','21603',36),(242,'Oriental','30101',37),(243,'Occidental','30102',37),(244,'Carmen','30103',37),(245,'San Nicolás','30104',37),(246,'Aguacaliente','30105',37),(247,'Guadalupe','30106',37),(248,'Corralillo','30107',37),(249,'Tierra Blanca','30108',37),(250,'Dulce Nombre','30109',37),(251,'Llano Grande','30110',37),(252,'Quebradilla','30111',37),(253,'Paraíso','30201',38),(254,'Santiago','30202',38),(255,'Orosi','30203',38),(256,'Cachí','30204',38),(257,'Llanos de Santa Lucía','30205',38),(258,'Tres Ríos','30301',39),(259,'San Diego','30302',39),(260,'San Juan','30303',39),(261,'San Rafael','30304',39),(262,'Concepción','30305',39),(263,'Dulce Nombre','30306',39),(264,'San Ramón','30307',39),(265,'Río Azul','30308',39),(266,'Juan Viñas','30401',40),(267,'Tucurrique','30402',40),(268,'Pejibaye','30403',40),(269,'Turrialba','30501',41),(270,'La Suiza','30502',41),(271,'Peralta','30503',41),(272,'Santa Cruz','30504',41),(273,'Santa Teresita','30505',41),(274,'Pavones','30506',41),(275,'Tuis','30507',41),(276,'Tayutic','30508',41),(277,'Santa Rosa','30509',41),(278,'Tres Equis','30510',41),(279,'La Isabel','30511',41),(280,'Chirripó','30512',41),(281,'Pacayas','30601',42),(282,'Cervantes','30602',42),(283,'Capellades','30603',42),(284,'San Rafael','30701',43),(285,'Cot','30702',43),(286,'Potrero Cerrado','30703',43),(287,'Cipreses','30704',43),(288,'Santa Rosa','30705',43),(289,'El Tejar','30801',44),(290,'San Isidro','30802',44),(291,'Tobosi','30803',44),(292,'Patio de Agua','30804',44),(293,'Heredia','40101',45),(294,'Mercedes','40102',45),(295,'San Francisco','40103',45),(296,'Ulloa','40104',45),(297,'Varablanca','40105',45),(298,'Barva','40201',46),(299,'San Pedro','40202',46),(300,'San Pablo','40203',46),(301,'San Roque','40204',46),(302,'Santa Lucía','40205',46),(303,'San José de la Montaña','40206',46),(304,'Santo Domingo','40301',47),(305,'San Vicente','40302',47),(306,'San Miguel','40303',47),(307,'Paracito','40304',47),(308,'Santo Tomás','40305',47),(309,'Santa Rosa','40306',47),(310,'Tures','40307',47),(311,'Para','40308',47),(312,'Santa Bárbara','40401',48),(313,'San Pedro','40402',48),(314,'San Juan','40403',48),(315,'Jesús','40404',48),(316,'Santo Domingo','40405',48),(317,'Puraba','40406',48),(318,'San Rafael','40501',49),(319,'San Josecito','40502',49),(320,'Santiago','40503',49),(321,'Ángeles','40504',49),(322,'Concepción','40505',49),(323,'San Isidro','40601',50),(324,'San José','40602',50),(325,'Concepción','40603',50),(326,'San Francisco','40604',50),(327,'San Antonio','40701',51),(328,'La Ribera','40702',51),(329,'La Asunción','40703',51),(330,'San Joaquín','40801',52),(331,'Barrantes','40802',52),(332,'Llorente','40803',52),(333,'San Pablo','40901',53),(334,'Rincón de Sabanilla','40902',53),(335,'Puerto Viejo','41001',54),(336,'La Virgen','41002',54),(337,'Las Horquetas','41003',54),(338,'Llanuras del Gaspar','41004',54),(339,'Cureña','41005',54),(340,'Liberia','50101',55),(341,'Cañas Dulces','50102',55),(342,'Mayorga','50103',55),(343,'Nacascolo','50104',55),(344,'Curubandé','50105',55),(345,'Nicoya','50201',56),(346,'Mansión','50202',56),(347,'San Antonio','50203',56),(348,'Quebrada Honda','50204',56),(349,'Sámara','50205',56),(350,'Nosara','50206',56),(351,'Belén de Nosarita','50207',56),(352,'Santa Cruz','50301',57),(353,'Bolsón','50302',57),(354,'Veintisiete de Abril','50303',57),(355,'Tempate','50304',57),(356,'Cartagena','50305',57),(357,'Cuajiniquil','50306',57),(358,'Diriá','50307',57),(359,'Cabo Velas','50308',57),(360,'Tamarindo','50309',57),(361,'Bagaces','50401',58),(362,'La Fortuna','50402',58),(363,'Mogote','50403',58),(364,'Río Naranjo','50404',58),(365,'Filadelfia','50501',59),(366,'Palmira','50502',59),(367,'Sardinal','50503',59),(368,'Belén','50504',59),(369,'Cañas','50601',60),(370,'Palmira','50602',60),(371,'San Miguel','50603',60),(372,'Bebedero','50604',60),(373,'Porozal','50605',60),(374,'Las Juntas','50701',61),(375,'Sierra','50702',61),(376,'San Juan','50703',61),(377,'Colorado','50704',61),(378,'Tilarán','50801',62),(379,'Quebrada Grande','50802',62),(380,'Tronadora','50803',62),(381,'Santa Rosa','50804',62),(382,'Líbano','50805',62),(383,'Tierras Morenas','50806',62),(384,'Arenal','50807',62),(385,'Cabeceras','50808',62),(386,'Carmona','50901',63),(387,'Santa Rita','50902',63),(388,'Zapotal','50903',63),(389,'San Pablo','50904',63),(390,'Porvenir','50905',63),(391,'Bejuco','50906',63),(392,'La Cruz','51001',64),(393,'Santa Cecilia','51002',64),(394,'La Garita','51003',64),(395,'Santa Elena','51004',64),(396,'Hojancha','51101',65),(397,'Monte Romo','51102',65),(398,'Puerto Carrillo','51103',65),(399,'Huacas','51104',65),(400,'Matambú','51105',65),(401,'Puntarenas','60101',66),(402,'Pitahaya','60102',66),(403,'Chomes','60103',66),(404,'Lepanto','60104',66),(405,'Paquera','60105',66),(406,'Manzanillo','60106',66),(407,'Guacimal','60107',66),(408,'Barranca','60108',66),(409,'Monte Verde','60109',66),(410,'Isla del Coco','60110',66),(411,'Cóbano','60111',66),(412,'Chacarita','60112',66),(413,'Chira','60113',66),(414,'Acapulco','60114',66),(415,'El Roble','60115',66),(416,'Arancibia','60116',66),(417,'Espíritu Santo','60201',67),(418,'San Juan Grande','60202',67),(419,'Macacona','60203',67),(420,'San Rafael','60204',67),(421,'San Jerónimo','60205',67),(422,'Caldera','60206',67),(423,'Buenos Aires','60301',68),(424,'Volcán','60302',68),(425,'Potrero Grande','60303',68),(426,'Boruca','60304',68),(427,'Pilas','60305',68),(428,'Colinas','60306',68),(429,'Chánguena','60307',68),(430,'Biolley','60308',68),(431,'Brunka','60309',68),(432,'Miramar','60401',69),(433,'La Unión','60402',69),(434,'San Isidro','60403',69),(435,'Puerto Cortés','60501',70),(436,'Palmar','60502',70),(437,'Sierpe','60503',70),(438,'Bahía Ballena','60504',70),(439,'Piedras Blancas','60505',70),(440,'Bahía Drake','60506',70),(441,'Quepos','60601',71),(442,'Savegre','60602',71),(443,'Naranjito','60603',71),(444,'Golfito','60701',72),(445,'Puerto Jiménez','60702',72),(446,'Guaycará','60703',72),(447,'Pavón','60704',72),(448,'San Vito','60801',73),(449,'Sabalito','60802',73),(450,'Aguabuena','60803',73),(451,'Limoncito','60804',73),(452,'Pittier','60805',73),(453,'Gutiérrez Braun','60806',73),(454,'Parrita','60901',74),(455,'Quepos','60902',74),(456,'Savegre','60903',74),(457,'Corredor','61001',75),(458,'La Cuesta','61002',75),(459,'Canoas','61003',75),(460,'Laurel','61004',75),(461,'Jacó','61101',76),(462,'Tárcoles','61102',76),(463,'El Roble','61103',76),(464,'Limón','70101',77),(465,'Valle La Estrella','70102',77),(466,'Río Blanco','70103',77),(467,'Matama','70104',77),(468,'Guápiles','70201',78),(469,'Jiménez','70202',78),(470,'Rita','70203',78),(471,'Roxana','70204',78),(472,'Cariari','70205',78),(473,'Colorado','70206',78),(474,'La Colonia','70207',78),(475,'Siquirres','70301',79),(476,'Pacuarito','70302',79),(477,'Florida','70303',79),(478,'Germania','70304',79),(479,'El Cairo','70305',79),(480,'Alegría','70306',79),(481,'Reventazón','70307',79),(482,'Bratsi','70401',80),(483,'Sixaola','70402',80),(484,'Cahuita','70403',80),(485,'Telire','70404',80),(486,'Matina','70501',81),(487,'Batán','70502',81),(488,'Carrandi','70503',81),(489,'Guácimo','70601',82),(490,'Mercedes','70602',82),(491,'Pocora','70603',82),(492,'Río Jiménez','70604',82),(493,'Duacarí','70605',82);
/*!40000 ALTER TABLE `distrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `envio`
--

DROP TABLE IF EXISTS `envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `envio` (
  `idEnvio` int NOT NULL AUTO_INCREMENT,
  `Fecha_envio` datetime NOT NULL,
  `Fecha_entrega` datetime DEFAULT NULL,
  `Direccion_entrega` varchar(500) NOT NULL,
  `Pedido_idPedido` int NOT NULL,
  `Catalogo_Estado_Envio_idCatalogo_Estado_Envio` int NOT NULL,
  PRIMARY KEY (`idEnvio`),
  KEY `fk_Envio_Pedido1_idx` (`Pedido_idPedido`),
  KEY `fk_Envio_Catalogo_Estado_Envio1_idx` (`Catalogo_Estado_Envio_idCatalogo_Estado_Envio`),
  CONSTRAINT `fk_Envio_Catalogo_Estado_Envio1` FOREIGN KEY (`Catalogo_Estado_Envio_idCatalogo_Estado_Envio`) REFERENCES `catalogo_estado_envio` (`idCatalogo_Estado_Envio`),
  CONSTRAINT `fk_Envio_Pedido1` FOREIGN KEY (`Pedido_idPedido`) REFERENCES `pedido` (`idPedido`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `envio`
--

LOCK TABLES `envio` WRITE;
/*!40000 ALTER TABLE `envio` DISABLE KEYS */;
INSERT INTO `envio` VALUES (1,'2026-02-24 18:58:43',NULL,'100m norte del parque central',1,1),(2,'2026-02-24 19:04:49','2026-02-24 19:04:49','200m sur del banco',2,3);
/*!40000 ALTER TABLE `envio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura`
--

DROP TABLE IF EXISTS `factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura` (
  `idFactura` int NOT NULL AUTO_INCREMENT,
  `fecha_factura` datetime NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `anulada` bit(1) NOT NULL,
  PRIMARY KEY (`idFactura`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura`
--

LOCK TABLES `factura` WRITE;
/*!40000 ALTER TABLE `factura` DISABLE KEYS */;
INSERT INTO `factura` VALUES (1,'2026-02-24 18:58:43',230.00,_binary '\0'),(2,'2026-02-24 19:04:49',45.00,_binary '\0');
/*!40000 ALTER TABLE `factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `factura_detalle`
--

DROP TABLE IF EXISTS `factura_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `factura_detalle` (
  `idFactura_Detalle` int NOT NULL AUTO_INCREMENT,
  `Cantidad` int NOT NULL,
  `SubTotal` decimal(10,2) NOT NULL,
  `Precio` decimal(10,2) NOT NULL,
  `Factura_idFactura` int NOT NULL,
  `producto_idproducto` int NOT NULL,
  PRIMARY KEY (`idFactura_Detalle`),
  KEY `fk_Factura_Detalle_Factura1_idx` (`Factura_idFactura`),
  KEY `fk_Factura_Detalle_producto1_idx` (`producto_idproducto`),
  CONSTRAINT `fk_Factura_Detalle_Factura1` FOREIGN KEY (`Factura_idFactura`) REFERENCES `factura` (`idFactura`),
  CONSTRAINT `fk_Factura_Detalle_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `factura_detalle`
--

LOCK TABLES `factura_detalle` WRITE;
/*!40000 ALTER TABLE `factura_detalle` DISABLE KEYS */;
INSERT INTO `factura_detalle` VALUES (1,1,150.00,150.00,1,1),(2,1,80.00,80.00,1,2),(3,1,45.00,45.00,2,3);
/*!40000 ALTER TABLE `factura_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_Pago` int NOT NULL AUTO_INCREMENT,
  `Fecha_pago` datetime NOT NULL,
  `Monto` decimal(10,2) NOT NULL,
  `Activo` bit(1) NOT NULL,
  `Catalogo_metodo_pago_idCatalogo_metodo_pago` int NOT NULL,
  `Catalogo_estado_pago_idCatalogo_estado_pago` int NOT NULL,
  `Factura_idFactura` int NOT NULL,
  PRIMARY KEY (`id_Pago`),
  KEY `fk_Pago_Catalogo_metodo_pago1_idx` (`Catalogo_metodo_pago_idCatalogo_metodo_pago`),
  KEY `fk_Pago_Catalogo_estado_pago1_idx` (`Catalogo_estado_pago_idCatalogo_estado_pago`),
  KEY `fk_Pago_Factura1_idx` (`Factura_idFactura`),
  CONSTRAINT `fk_Pago_Catalogo_estado_pago1` FOREIGN KEY (`Catalogo_estado_pago_idCatalogo_estado_pago`) REFERENCES `catalogo_estado_pago` (`idCatalogo_estado_pago`),
  CONSTRAINT `fk_Pago_Catalogo_metodo_pago1` FOREIGN KEY (`Catalogo_metodo_pago_idCatalogo_metodo_pago`) REFERENCES `catalogo_metodo_pago` (`idCatalogo_metodo_pago`),
  CONSTRAINT `fk_Pago_Factura1` FOREIGN KEY (`Factura_idFactura`) REFERENCES `factura` (`idFactura`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,'2026-02-24 18:58:43',230.00,_binary '',1,1,1),(2,'2026-02-24 19:04:49',45.00,_binary '',2,2,2);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `Fecha_Pedido` datetime NOT NULL,
  `Total` decimal(10,2) NOT NULL,
  `Cliente_id_Cliente` int NOT NULL,
  `Factura_idFactura` int NOT NULL,
  `Catalogo_estado_Pedido_idCatalogo_estado_Pedido` int NOT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `fk_Pedido_Cliente1_idx` (`Cliente_id_Cliente`),
  KEY `fk_Pedido_Factura1_idx` (`Factura_idFactura`),
  KEY `fk_Pedido_Catalogo_estado_Pedido1_idx` (`Catalogo_estado_Pedido_idCatalogo_estado_Pedido`),
  CONSTRAINT `fk_Pedido_Catalogo_estado_Pedido1` FOREIGN KEY (`Catalogo_estado_Pedido_idCatalogo_estado_Pedido`) REFERENCES `catalogo_estado_pedido` (`idCatalogo_estado_Pedido`),
  CONSTRAINT `fk_Pedido_Cliente1` FOREIGN KEY (`Cliente_id_Cliente`) REFERENCES `cliente` (`id_Cliente`),
  CONSTRAINT `fk_Pedido_Factura1` FOREIGN KEY (`Factura_idFactura`) REFERENCES `factura` (`idFactura`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,'2026-02-24 18:58:43',230.00,1,1,1),(2,'2026-02-24 19:04:49',45.00,2,2,3);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido_detalle`
--

DROP TABLE IF EXISTS `pedido_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido_detalle` (
  `idpedido_detalle` int NOT NULL AUTO_INCREMENT,
  `Cantidad` int NOT NULL,
  `Precio_unitario` decimal(10,2) NOT NULL,
  `Subtotal` decimal(10,2) NOT NULL,
  `producto_idproducto` int NOT NULL,
  `Pedido_idPedido` int NOT NULL,
  PRIMARY KEY (`idpedido_detalle`),
  KEY `fk_pedido_detalle_producto1_idx` (`producto_idproducto`),
  KEY `fk_pedido_detalle_Pedido1_idx` (`Pedido_idPedido`),
  CONSTRAINT `fk_pedido_detalle_Pedido1` FOREIGN KEY (`Pedido_idPedido`) REFERENCES `pedido` (`idPedido`),
  CONSTRAINT `fk_pedido_detalle_producto1` FOREIGN KEY (`producto_idproducto`) REFERENCES `producto` (`idproducto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido_detalle`
--

LOCK TABLES `pedido_detalle` WRITE;
/*!40000 ALTER TABLE `pedido_detalle` DISABLE KEYS */;
INSERT INTO `pedido_detalle` VALUES (1,1,150.00,150.00,1,1),(2,1,80.00,80.00,2,1),(3,1,45.00,45.00,3,2);
/*!40000 ALTER TABLE `pedido_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id_Persona` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(45) NOT NULL,
  `Apellido1` varchar(45) NOT NULL,
  `Apellido2` varchar(45) NOT NULL,
  `Telefono` varchar(45) NOT NULL,
  `Activo` bit(1) NOT NULL,
  `Catalogo_Telefono_estado_idCatalogo_Telefono_estado` int NOT NULL,
  `Catalogo_Genero_idCatalogo_Genero` int NOT NULL,
  `Email` varchar(255) NOT NULL,
  PRIMARY KEY (`id_Persona`),
  KEY `fk_Persona_Catalogo_Telefono_estado_idx` (`Catalogo_Telefono_estado_idCatalogo_Telefono_estado`),
  KEY `fk_Persona_Catalogo_Genero1_idx` (`Catalogo_Genero_idCatalogo_Genero`),
  CONSTRAINT `fk_Persona_Catalogo_Genero1` FOREIGN KEY (`Catalogo_Genero_idCatalogo_Genero`) REFERENCES `catalogo_genero` (`idCatalogo_Genero`),
  CONSTRAINT `fk_Persona_Catalogo_Telefono_estado` FOREIGN KEY (`Catalogo_Telefono_estado_idCatalogo_Telefono_estado`) REFERENCES `catalogo_telefono_estado` (`id_Catalogo_Telefono_estado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'Andrés','Rodríguez','Chaves','8888-7777',_binary '',1,1,'andres@ejemplo.com'),(2,'María','González','López','7777-1234',_binary '',1,2,'maria@ejemplo.com');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `idproducto` int NOT NULL AUTO_INCREMENT,
  `Nombre_producto` varchar(45) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `descripcion_producto` varchar(200) NOT NULL,
  `Activo` bit(1) NOT NULL,
  `Catalogo_estado_stock_idCatalogo_estado_stock` int NOT NULL,
  PRIMARY KEY (`idproducto`),
  KEY `fk_producto_Catalogo_estado_stock1_idx` (`Catalogo_estado_stock_idCatalogo_estado_stock`),
  CONSTRAINT `fk_producto_Catalogo_estado_stock1` FOREIGN KEY (`Catalogo_estado_stock_idCatalogo_estado_stock`) REFERENCES `catalogo_estado_stock` (`idCatalogo_estado_stock`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Monitor 24 pulgadas',150.00,'FHD 75Hz',_binary '',1),(2,'Teclado Mecánico',80.00,'RGB Switch Blue',_binary '',1),(3,'Mouse Gamer',45.00,'DPI 1600 RGB',_binary '',2);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincia`
--

DROP TABLE IF EXISTS `provincia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincia` (
  `idProvincia` int NOT NULL AUTO_INCREMENT,
  `Nombre_Provincia` varchar(45) NOT NULL,
  PRIMARY KEY (`idProvincia`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincia`
--

LOCK TABLES `provincia` WRITE;
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
INSERT INTO `provincia` VALUES (1,'San José'),(2,'Alajuela'),(3,'Cartago'),(4,'Heredia'),(5,'Guanacaste'),(6,'Puntarenas'),(7,'Limón');
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol_usuario`
--

DROP TABLE IF EXISTS `rol_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_usuario` (
  `idrol_usuario` int NOT NULL AUTO_INCREMENT,
  `Nombre_rol` varchar(45) NOT NULL,
  `Descripcion` varchar(45) NOT NULL,
  PRIMARY KEY (`idrol_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol_usuario`
--

LOCK TABLES `rol_usuario` WRITE;
/*!40000 ALTER TABLE `rol_usuario` DISABLE KEYS */;
INSERT INTO `rol_usuario` VALUES (1,'Administrador','Acceso total'),(2,'Cliente','Acceso limitado');
/*!40000 ALTER TABLE `rol_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_direccion`
--

DROP TABLE IF EXISTS `tipo_direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_direccion` (
  `idTipo_Direccion` int NOT NULL AUTO_INCREMENT,
  `Descripcion_Direccion` varchar(45) NOT NULL,
  `Activo` bit(1) NOT NULL,
  PRIMARY KEY (`idTipo_Direccion`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_direccion`
--

LOCK TABLES `tipo_direccion` WRITE;
/*!40000 ALTER TABLE `tipo_direccion` DISABLE KEYS */;
INSERT INTO `tipo_direccion` VALUES (1,'Casa',_binary ''),(2,'Trabajo',_binary '');
/*!40000 ALTER TABLE `tipo_direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) NOT NULL,
  `Activo` bit(1) NOT NULL,
  `Fecha_creacion` datetime NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Nombre_usuario` varchar(45) NOT NULL,
  `rol_usuario_idrol_usuario` int NOT NULL,
  `Persona_id_Persona` int NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `Email_UNIQUE` (`Email`),
  UNIQUE KEY `Nombre_usuario_UNIQUE` (`Nombre_usuario`),
  KEY `fk_Usuario_rol_usuario1_idx` (`rol_usuario_idrol_usuario`),
  KEY `fk_Usuario_Persona1_idx` (`Persona_id_Persona`),
  CONSTRAINT `fk_Usuario_Persona1` FOREIGN KEY (`Persona_id_Persona`) REFERENCES `persona` (`id_Persona`),
  CONSTRAINT `fk_Usuario_rol_usuario1` FOREIGN KEY (`rol_usuario_idrol_usuario`) REFERENCES `rol_usuario` (`idrol_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'andres@ejemplo.com',_binary '','2026-02-24 18:58:43','pass123','arodriguez',1,1),(2,'maria@ejemplo.com',_binary '','2026-02-24 19:04:49','pass456','mgonzalez',2,2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-24 19:25:22
