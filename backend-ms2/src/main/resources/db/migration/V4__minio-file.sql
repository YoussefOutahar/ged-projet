DROP TABLE IF EXISTS `fichier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichier` (
                           `id` bigint NOT NULL,
                           `bucket` varchar(255) DEFAULT NULL,
                           `full_path` varchar(255) NOT NULL,
                           `object_name` varchar(255) NOT NULL,
                           `path` varchar(255) DEFAULT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `fichier_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fichier_version` (
                                   `version_id` varchar(100) NOT NULL,
                                   `version_number` int NOT NULL,
                                   `fichier_id` bigint NOT NULL,
                                   PRIMARY KEY (`version_id`),
                                   KEY `FKeher7s4o3qi6cuqq2cfbtfe8a` (`fichier_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
