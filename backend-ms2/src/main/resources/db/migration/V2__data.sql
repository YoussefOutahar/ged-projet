-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 22 août 2023 à 01:36
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.0.28

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ged`
--

--
-- Déchargement des données de la table `access_share`
--

INSERT INTO `access_share` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-02 14:51:07', 'anonymousUser', '2023-08-21 21:12:57', 'ecriture-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500', 'Ecriture', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-02 14:51:19', 'anonymousUser', '2023-08-21 21:12:46', 'lecture-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Lecture', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `access_share_seq`
--

INSERT INTO `access_share_seq` (`next_val`) VALUES
(2),
(2);

--
-- Déchargement des données de la table `document_categorie`
--

INSERT INTO `document_categorie` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-20 15:08:19', 'anonymousUser', '2023-08-21 22:23:36', 'facture-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Facture', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-20 15:10:55', 'anonymousUser', '2023-08-20 15:21:57', 'bon-achat-reference', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Bon d\'achat', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-20 15:11:22', 'anonymousUser', '2023-08-20 15:22:02', 'devis-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Devis', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `document_categorie_index`
--

INSERT INTO `document_categorie_index` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `document_categorie`, `document_categorie_index_rule`, `index_element`) VALUES
(4, 'anonymousUser', '2023-08-20 15:17:40', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 4),
(2, 'anonymousUser', '2023-08-20 15:17:20', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 2),
(3, 'anonymousUser', '2023-08-20 15:17:20', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 3),
(5, 'anonymousUser', '2023-08-20 15:21:30', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, 1),
(6, 'anonymousUser', '2023-08-20 15:21:30', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, 3),
(7, 'anonymousUser', '2023-08-20 15:21:43', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 1),
(8, 'anonymousUser', '2023-08-20 15:21:43', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 3),
(9, 'anonymousUser', '2023-08-21 22:23:36', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 2);

--
-- Déchargement des données de la table `document_categorie_index_rule_seq`
--

INSERT INTO `document_categorie_index_rule_seq` (`next_val`) VALUES
(1),
(1),
(1),
(1),
(1),
(1);

--
-- Déchargement des données de la table `document_categorie_index_seq`
--

INSERT INTO `document_categorie_index_seq` (`next_val`) VALUES
(10),
(10),
(10),
(10),
(1),
(1);

--
-- Déchargement des données de la table `document_categorie_model_seq`
--

INSERT INTO `document_categorie_model_seq` (`next_val`) VALUES
(1),
(1),
(1),
(1),
(1),
(1);

--
-- Déchargement des données de la table `document_categorie_seq`
--

INSERT INTO `document_categorie_seq` (`next_val`) VALUES
(4),
(4),
(6),
(6),
(1),
(1);

--
-- Déchargement des données de la table `document_index_element_seq`
--

INSERT INTO `document_index_element_seq` (`next_val`) VALUES
(4),
(4),
(4),
(4),
(1),
(1);

--
-- Déchargement des données de la table `document_partage_groupe`
--

INSERT INTO `document_partage_groupe` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `date_share`, `description`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `access_share`, `document`, `groupe`) VALUES
(5, 'anonymousUser', '2023-08-05 09:06:59', '', NULL, '2023-08-13 20:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 11, 1),
(6, 'anonymousUser', '2023-08-05 09:06:59', '', NULL, '2023-08-23 20:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 11, 3),
(9, 'anonymousUser', '2023-08-05 14:42:50', '', NULL, '2023-08-14 20:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 13, 2),
(10, 'anonymousUser', '2023-08-05 14:42:50', '', NULL, '2023-08-24 20:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 13, 3),
(13, 'anonymousUser', '2023-08-11 14:57:47', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 21, 1),
(14, 'anonymousUser', '2023-08-11 14:57:47', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 21, 2);

--
-- Déchargement des données de la table `document_partage_groupe_seq`
--

INSERT INTO `document_partage_groupe_seq` (`next_val`) VALUES
(1),
(1),
(15),
(15),
(1),
(1);

--
-- Déchargement des données de la table `document_partage_utilisateur_seq`
--

INSERT INTO `document_partage_utilisateur_seq` (`next_val`) VALUES
(1),
(1),
(1),
(1),
(1),
(1);

--
-- Déchargement des données de la table `document_seq`
--

INSERT INTO `document_seq` (`next_val`) VALUES
(16),
(16),
(22),
(22),
(1),
(1);

--
-- Déchargement des données de la table `document_state`
--

INSERT INTO `document_state` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `style`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-01 20:43:22', 'anonymousUser', '2023-08-20 14:49:44', 'valide-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Validé', 'success', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-01 20:43:43', 'anonymousUser', '2023-08-21 22:22:56', 'rejeté-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Rejeté', 'danger', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-06 21:00:12', 'anonymousUser', '2023-08-20 14:53:44', 'en-cours-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'En Cours', 'warning', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'anonymousUser', '2023-08-06 21:50:34', 'anonymousUser', '2023-08-21 22:24:01', 'en-instance-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'En instance', 'info', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `document_state_seq`
--

INSERT INTO `document_state_seq` (`next_val`) VALUES
(6),
(6),
(6),
(6),
(1),
(1);

--
-- Déchargement des données de la table `document_tag`
--

INSERT INTO `document_tag` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `document`, `tag`) VALUES
(3, 'anonymousUser', '2023-08-04 23:02:09', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 3);

--
-- Déchargement des données de la table `document_tag_seq`
--

INSERT INTO `document_tag_seq` (`next_val`) VALUES
(1),
(1),
(4),
(4),
(1),
(1);

--
-- Déchargement des données de la table `document_type`
--

INSERT INTO `document_type` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-01 20:39:21', 'anonymousUser', '2023-08-20 15:15:37', 'image-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Image', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-01 20:39:27', 'anonymousUser', '2023-08-20 15:15:24', 'pdf-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500', 'Pdf', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `document_type_seq`
--

INSERT INTO `document_type_seq` (`next_val`) VALUES (3);

--
-- Déchargement des données de la table `entite_administrative`
--

INSERT INTO `entite_administrative` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `reference_ged`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `chef`, `entite_administrative_parent`, `entite_administrative_type`) VALUES
(2, 'anonymousUser', '2023-08-20 15:27:49', 'anonymousUser', '2023-08-21 22:06:38', 'departement-info-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Département Informatique', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 152, NULL, 1),
(3, 'anonymousUser', '2023-08-20 21:13:01', 'anonymousUser', '2023-08-21 22:06:34', 'departement-rh-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Département Ressources Humain', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 1),
(7, 'anonymousUser', '2023-08-21 21:38:42', '', NULL, 'entite-test-groupe-ref', 'lorem ipsum....', 'Entite test groupe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 152, 2, 1),
(8, 'anonymousUser', '2023-08-21 22:25:00', '', NULL, 'entite-test-ref', 'description .... ', 'ENtite Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 3, 2);

--
-- Déchargement des données de la table `entite_administrative_seq`
--

INSERT INTO `entite_administrative_seq` (`next_val`) VALUES
(13),
(13),
(13),
(13),
(1),
(1);

--
-- Déchargement des données de la table `entite_administrative_type`
--

INSERT INTO `entite_administrative_type` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-02 15:00:43', 'anonymousUser', '2023-08-20 15:22:57', 'departement-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Département', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-02 15:01:03', 'anonymousUser', '2023-08-20 15:22:47', 'division-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Division', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-02 15:01:12', 'anonymousUser', '2023-08-21 22:24:20', 'service-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500 ---- Ahmed', 'Service', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `entite_administrative_type_seq`
--

INSERT INTO `entite_administrative_type_seq` (`next_val`) VALUES
(1),
(1),
(4),
(4),
(1),
(1);

--
-- Déchargement des données de la table `etablissement_seq`
--

INSERT INTO `etablissement_seq` (`next_val`) VALUES
(1),
(1),
(1),
(1),
(1);

--
-- Déchargement des données de la table `etat_utilisateur`
--

INSERT INTO `etat_utilisateur` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-02 14:50:37', 'anonymousUser', '2023-08-21 21:13:38', 'licencie-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500', 'Licencié', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-02 14:50:51', 'anonymousUser', '2023-08-21 22:55:57', 'actif', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500', 'Actif', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-21 21:13:55', '', NULL, 'retraite-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 150', 'Retraité', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `etat_utilisateur_seq`
--

INSERT INTO `etat_utilisateur_seq` (`next_val`) VALUES
(7),
(7),
(7),
(7),
(7),
(7);

--
-- Déchargement des données de la table `gender`
--

INSERT INTO `gender` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-20 06:49:18', 'anonymousUser', '2023-08-20 15:25:37', 'male-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Monsieur', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-20 06:49:34', 'anonymousUser', '2023-08-20 15:25:26', 'female-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Madame', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `gender_seq`
--

INSERT INTO `gender_seq` (`next_val`) VALUES
(3),
(3),
(3),
(3),
(1),
(1);

--
-- Déchargement des données de la table `groupe`
--

INSERT INTO `groupe` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `utilisateur`) VALUES
(3, 'anonymousUser', '2023-08-21 22:19:54', 'anonymousUser', '2023-08-21 22:26:59', 'groupe-1-ref', 'Groupe 1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 152);

--
-- Déchargement des données de la table `groupe_seq`
--

INSERT INTO `groupe_seq` (`next_val`) VALUES
(7),
(7),
(7),
(7),
(7),
(7);

--
-- Déchargement des données de la table `groupe_utilisateur`
--

INSERT INTO `groupe_utilisateur` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `date_ajout`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `etat_utilisateur`, `groupe`, `role_utilisateur`, `utilisateur`) VALUES
(3, 'anonymousUser', '2023-08-21 22:19:55', '', NULL, '2023-08-21 22:19:41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 3, 1, 152),
(5, 'anonymousUser', '2023-08-21 22:26:59', '', NULL, '2023-08-21 22:26:38', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 3, 1, 2),
(6, 'anonymousUser', '2023-08-21 22:26:59', '', NULL, '2023-08-21 22:26:51', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 3, 2, 3),
(9, 'anonymousUser', '2023-08-21 22:54:00', '', NULL, '2023-08-21 22:54:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, 6, 3, 1);

--
-- Déchargement des données de la table `groupe_utilisateur_seq`
--

INSERT INTO `groupe_utilisateur_seq` (`next_val`) VALUES
(10),
(10),
(10),
(10),
(10),
(10);

--
-- Déchargement des données de la table `hibernate_sequence`
--

INSERT INTO `hibernate_sequence` (`next_val`) VALUES
(4),
(4),
(4),
(4),
(153),
(153),
(153),
(4),
(4),
(4),
(4),
(4),
(4),
(4),
(1),
(1),
(1),
(1);

--
-- Déchargement des données de la table `index_element`
--

INSERT INTO `index_element` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-20 06:58:56', 'anonymousUser', '2023-08-20 15:13:00', 'montant-tva-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Montant TVA', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-20 15:13:25', 'anonymousUser', '2023-08-20 15:13:36', 'date-echeance-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Date Echeance', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-20 15:13:56', '', NULL, 'montant-ttc-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Montant TTC', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(4, 'anonymousUser', '2023-08-20 15:14:11', '', NULL, 'montant-ht-ref', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500,', 'Montant HT', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `index_element_seq`
--

INSERT INTO `index_element_seq` (`next_val`) VALUES
(6),
(6),
(6),
(6),
(1),
(1);

--
-- Déchargement des données de la table `permission`
--

INSERT INTO `permission` (`id`, `name`) VALUES
(1, 'DocumentPartageGroupe.edit'),
(2, 'DocumentPartageGroupe.list'),
(3, 'DocumentPartageGroupe.view'),
(4, 'DocumentPartageGroupe.add'),
(5, 'DocumentPartageGroupe.delete'),
(6, 'EtatUtilisateur.edit'),
(7, 'EtatUtilisateur.list'),
(8, 'EtatUtilisateur.view'),
(9, 'EtatUtilisateur.add'),
(10, 'EtatUtilisateur.delete'),
(11, 'GroupeUtilisateur.edit'),
(12, 'GroupeUtilisateur.list'),
(13, 'GroupeUtilisateur.view'),
(14, 'GroupeUtilisateur.add'),
(15, 'GroupeUtilisateur.delete'),
(16, 'RoleUtilisateur.edit'),
(17, 'RoleUtilisateur.list'),
(18, 'RoleUtilisateur.view'),
(19, 'RoleUtilisateur.add'),
(20, 'RoleUtilisateur.delete'),
(21, 'Document.edit'),
(22, 'Document.list'),
(23, 'Document.view'),
(24, 'Document.add'),
(25, 'Document.delete'),
(26, 'DocumentField.edit'),
(27, 'DocumentField.list'),
(28, 'DocumentField.view'),
(29, 'DocumentField.add'),
(30, 'DocumentField.delete'),
(31, 'DocumentFieldState.edit'),
(32, 'DocumentFieldState.list'),
(33, 'DocumentFieldState.view'),
(34, 'DocumentFieldState.add'),
(35, 'DocumentFieldState.delete'),
(36, 'EntiteAdministrativeType.edit'),
(37, 'EntiteAdministrativeType.list'),
(38, 'EntiteAdministrativeType.view'),
(39, 'EntiteAdministrativeType.add'),
(40, 'EntiteAdministrativeType.delete'),
(41, 'DocumentPartageUtilisateur.edit'),
(42, 'DocumentPartageUtilisateur.list'),
(43, 'DocumentPartageUtilisateur.view'),
(44, 'DocumentPartageUtilisateur.add'),
(45, 'DocumentPartageUtilisateur.delete'),
(46, 'DocumentCategorie.edit'),
(47, 'DocumentCategorie.list'),
(48, 'DocumentCategorie.view'),
(49, 'DocumentCategorie.add'),
(50, 'DocumentCategorie.delete'),
(51, 'DocumentCategorieFieldRule.edit'),
(52, 'DocumentCategorieFieldRule.list'),
(53, 'DocumentCategorieFieldRule.view'),
(54, 'DocumentCategorieFieldRule.add'),
(55, 'DocumentCategorieFieldRule.delete'),
(56, 'Groupe.edit'),
(57, 'Groupe.list'),
(58, 'Groupe.view'),
(59, 'Groupe.add'),
(60, 'Groupe.delete'),
(61, 'Field.edit'),
(62, 'Field.list'),
(63, 'Field.view'),
(64, 'Field.add'),
(65, 'Field.delete'),
(66, 'Utilisateur.edit'),
(67, 'Utilisateur.list'),
(68, 'Utilisateur.view'),
(69, 'Utilisateur.add'),
(70, 'Utilisateur.delete'),
(71, 'DocumentState.edit'),
(72, 'DocumentState.list'),
(73, 'DocumentState.view'),
(74, 'DocumentState.add'),
(75, 'DocumentState.delete'),
(76, 'AccessShare.edit'),
(77, 'AccessShare.list'),
(78, 'AccessShare.view'),
(79, 'AccessShare.add'),
(80, 'AccessShare.delete'),
(81, 'DocumentCategorieField.edit'),
(82, 'DocumentCategorieField.list'),
(83, 'DocumentCategorieField.view'),
(84, 'DocumentCategorieField.add'),
(85, 'DocumentCategorieField.delete'),
(86, 'DocumentType.edit'),
(87, 'DocumentType.list'),
(88, 'DocumentType.view'),
(89, 'DocumentType.add'),
(90, 'DocumentType.delete'),
(91, 'EntiteAdministrative.edit'),
(92, 'EntiteAdministrative.list'),
(93, 'EntiteAdministrative.view'),
(94, 'EntiteAdministrative.add'),
(95, 'EntiteAdministrative.delete'),
(100, 'DocumentCategorieModel.edit'),
(101, 'DocumentCategorieModel.list'),
(102, 'DocumentCategorieModel.view'),
(103, 'DocumentCategorieModel.add'),
(104, 'DocumentCategorieModel.delete'),
(105, 'DocumentTag.edit'),
(106, 'DocumentTag.list'),
(107, 'DocumentTag.view'),
(108, 'DocumentTag.add'),
(109, 'DocumentTag.delete'),
(110, 'DocumentIndexElement.edit'),
(111, 'DocumentIndexElement.list'),
(112, 'DocumentIndexElement.view'),
(113, 'DocumentIndexElement.add'),
(114, 'DocumentIndexElement.delete'),
(115, 'Gender.edit'),
(116, 'Gender.list'),
(117, 'Gender.view'),
(118, 'Gender.add'),
(119, 'Gender.delete'),
(120, 'Tag.edit'),
(121, 'Tag.list'),
(122, 'Tag.view'),
(123, 'Tag.add'),
(124, 'Tag.delete'),
(125, 'DocumentCategorieIndex.edit'),
(126, 'DocumentCategorieIndex.list'),
(127, 'DocumentCategorieIndex.view'),
(128, 'DocumentCategorieIndex.add'),
(129, 'DocumentCategorieIndex.delete'),
(130, 'DocumentCategorieIndexRule.edit'),
(131, 'DocumentCategorieIndexRule.list'),
(132, 'DocumentCategorieIndexRule.view'),
(133, 'DocumentCategorieIndexRule.add'),
(134, 'DocumentCategorieIndexRule.delete'),
(135, 'IndexElement.edit'),
(136, 'IndexElement.list'),
(137, 'IndexElement.view'),
(138, 'IndexElement.add'),
(139, 'IndexElement.delete');

--
-- Déchargement des données de la table `roles_permissions`
--

INSERT INTO `roles_permissions` (`role_id`, `permission_id`) VALUES
(96, 1),
(96, 2),
(96, 3),
(96, 4),
(96, 5),
(96, 6),
(96, 7),
(96, 8),
(96, 9),
(96, 10),
(96, 11),
(96, 12),
(96, 13),
(96, 14),
(96, 15),
(96, 16),
(96, 17),
(96, 18),
(96, 19),
(96, 20),
(96, 21),
(96, 22),
(96, 23),
(96, 24),
(96, 25),
(96, 26),
(96, 27),
(96, 28),
(96, 29),
(96, 30),
(96, 31),
(96, 32),
(96, 33),
(96, 34),
(96, 35),
(96, 36),
(96, 37),
(96, 38),
(96, 39),
(96, 40),
(96, 41),
(96, 42),
(96, 43),
(96, 44),
(96, 45),
(96, 46),
(96, 47),
(96, 48),
(96, 49),
(96, 50),
(96, 51),
(96, 52),
(96, 53),
(96, 54),
(96, 55),
(96, 56),
(96, 57),
(96, 58),
(96, 59),
(96, 60),
(96, 61),
(96, 62),
(96, 63),
(96, 64),
(96, 65),
(96, 66),
(96, 67),
(96, 68),
(96, 69),
(96, 70),
(96, 71),
(96, 72),
(96, 73),
(96, 74),
(96, 75),
(96, 76),
(96, 77),
(96, 78),
(96, 79),
(96, 80),
(96, 81),
(96, 82),
(96, 83),
(96, 84),
(96, 85),
(96, 86),
(96, 87),
(96, 88),
(96, 89),
(96, 90),
(96, 91),
(96, 92),
(96, 93),
(96, 94),
(96, 95),
(98, 1),
(98, 2),
(98, 3),
(98, 4),
(98, 5),
(98, 6),
(98, 7),
(98, 8),
(98, 9),
(98, 10),
(98, 11),
(98, 12),
(98, 13),
(98, 14),
(98, 15),
(98, 16),
(98, 17),
(98, 18),
(98, 19),
(98, 20),
(98, 21),
(98, 22),
(98, 23),
(98, 24),
(98, 25),
(98, 26),
(98, 27),
(98, 28),
(98, 29),
(98, 30),
(98, 31),
(98, 32),
(98, 33),
(98, 34),
(98, 35),
(98, 36),
(98, 37),
(98, 38),
(98, 39),
(98, 40),
(98, 41),
(98, 42),
(98, 43),
(98, 44),
(98, 45),
(98, 46),
(98, 47),
(98, 48),
(98, 49),
(98, 50),
(98, 51),
(98, 52),
(98, 53),
(98, 54),
(98, 55),
(98, 56),
(98, 57),
(98, 58),
(98, 59),
(98, 60),
(98, 61),
(98, 62),
(98, 63),
(98, 64),
(98, 65),
(98, 66),
(98, 67),
(98, 68),
(98, 69),
(98, 70),
(98, 71),
(98, 72),
(98, 73),
(98, 74),
(98, 75),
(98, 76),
(98, 77),
(98, 78),
(98, 79),
(98, 80),
(98, 81),
(98, 82),
(98, 83),
(98, 84),
(98, 85),
(98, 86),
(98, 87),
(98, 88),
(98, 89),
(98, 90),
(98, 91),
(98, 92),
(98, 93),
(98, 94),
(98, 95),
(140, 16),
(140, 17),
(140, 18),
(140, 19),
(140, 20),
(140, 86),
(140, 87),
(140, 88),
(140, 89),
(140, 90),
(140, 76),
(140, 77),
(140, 78),
(140, 79),
(140, 80),
(140, 21),
(140, 22),
(140, 23),
(140, 24),
(140, 25),
(140, 41),
(140, 42),
(140, 43),
(140, 44),
(140, 45),
(140, 46),
(140, 47),
(140, 48),
(140, 49),
(140, 50),
(140, 100),
(140, 101),
(140, 102),
(140, 103),
(140, 104),
(140, 105),
(140, 106),
(140, 107),
(140, 108),
(140, 109),
(140, 110),
(140, 111),
(140, 112),
(140, 113),
(140, 114),
(140, 71),
(140, 72),
(140, 73),
(140, 74),
(140, 75),
(140, 115),
(140, 116),
(140, 117),
(140, 118),
(140, 119),
(140, 11),
(140, 12),
(140, 13),
(140, 14),
(140, 15),
(140, 120),
(140, 121),
(140, 122),
(140, 123),
(140, 124),
(140, 125),
(140, 126),
(140, 127),
(140, 128),
(140, 129),
(140, 1),
(140, 2),
(140, 3),
(140, 4),
(140, 5),
(140, 36),
(140, 37),
(140, 38),
(140, 39),
(140, 40),
(140, 6),
(140, 7),
(140, 8),
(140, 9),
(140, 10),
(140, 66),
(140, 67),
(140, 68),
(140, 69),
(140, 70),
(140, 130),
(140, 131),
(140, 132),
(140, 133),
(140, 134),
(140, 135),
(140, 136),
(140, 137),
(140, 138),
(140, 139),
(140, 91),
(140, 92),
(140, 93),
(140, 94),
(140, 95),
(140, 56),
(140, 57),
(140, 58),
(140, 59),
(140, 60);

--
-- Déchargement des données de la table `role_app`
--

INSERT INTO `role_app` (`id`, `authority`, `created_at`, `label`, `updated_at`) VALUES
(96, 'ROLE_ADMIN', NULL, 'Admin', NULL),
(98, 'ROLE_AGENT', NULL, 'Agent', NULL),
(140, 'ROLE_COLLABORATEUR', NULL, 'Collaborateur', NULL);

--
-- Déchargement des données de la table `role_utilisateur`
--

INSERT INTO `role_utilisateur` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(97, 'anonymousUser', '2023-08-02 14:53:20', 'anonymousUser', '2023-08-21 22:55:42', 'admin', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Admin', NULL, NULL, NULL, NULL, NULL, 97, "admin"),
(2, 'anonymousUser', '2023-08-02 14:53:29', 'anonymousUser', '2023-08-21 22:56:46', 'membre', 'Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l\'imprimerie depuis les années 1500.', 'Membre', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `role_utilisateur_seq`
--

INSERT INTO `role_utilisateur_seq` (`next_val`) VALUES
(98);

--
-- Déchargement des données de la table `tag`
--

INSERT INTO `tag` (`id`, `createdby`, `createdon`, `updatedby`, `updatedon`, `code`, `description`, `libelle`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`) VALUES
(1, 'anonymousUser', '2023-08-02 11:28:33', '', NULL, 't1', NULL, 't1', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'anonymousUser', '2023-08-02 11:28:40', '', NULL, 't2', NULL, 't2', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 'anonymousUser', '2023-08-02 11:28:47', '', NULL, 't3', NULL, 't3', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Déchargement des données de la table `tag_seq`
--

INSERT INTO `tag_seq` (`next_val`) VALUES
(4);

--
-- Déchargement des données de la table `users_roles`
--

INSERT INTO `users_roles` (`user_id`, `role_id`) VALUES
(97, 96),
(99, 98),
(141, 140),
(146, 96),
(147, 96),
(147, 98),
(148, 96),
(148, 98),
(149, 140),
(151, 96),
(152, 96),
(1, 96),
(2, 98),
(3, 140);

--
-- Déchargement des données de la table `user_app`
--

INSERT INTO `user_app` (`id`, `created_by`, `created_on`, `updated_by`, `updated_on`, `account_non_expired`, `account_non_locked`, `created_at`, `credentials_non_expired`, `email`, `enabled`, `password`, `password_changed`, `updated_at`, `username`, `etablissement`, `nom`, `prenom`) VALUES
(97, NULL, '2023-08-01 20:34:08', NULL, NULL, b'1', b'1', '2023-08-01 20:34:08', b'1', 'admin', b'1', '$2a$10$IKO8Jpu5nr.iu/4oK2Bnu.89mwxc99hEnfh30T73WyEvqAi5/IQFu', b'0', NULL, 'admin', NULL, 'admin', 'admin'),
(99, NULL, '2023-08-01 20:34:08', NULL, NULL, b'1', b'1', '2023-08-01 20:34:08', b'1', 'agent', b'1', '$2a$10$QD3dh104N4oSHyh7GXii/.mdfGrtgpC/rEpf8yUndyWdAvUhs9abe', b'0', NULL, 'agent', NULL, 'agent', 'agent'),
(141, NULL, '2023-08-17 15:03:41', NULL, NULL, b'1', b'1', '2023-08-17 15:03:41', b'1', 'collaborateur', b'1', '$2a$10$Eh.paCOaMZvlkywDWjg1pu5AeDHhy8Yg3vZjwU6lqsvhCXysY3pRu', b'0', NULL, 'collaborateur', NULL, '', ''),
(152, NULL, NULL, 'anonymousUser', '2023-08-21 22:06:34', b'1', b'1', NULL, b'1', 'lidrissihamid@gmail.com', b'1', NULL, b'0', NULL, 'lidrissihamid@gmail.com', NULL, '', ''),
(1, NULL, NULL, 'anonymousUser', '2023-08-21 22:06:34', b'1', b'1', NULL, b'1', 'youness.zouani@gmail.com', b'1', NULL, b'0', NULL, 'youness.zouani@gmail.com', NULL, '', ''),
(2, 'anonymousUser', '2023-08-21 22:11:12', NULL, NULL, b'1', b'1', NULL, b'1', 'ahmed.toufik@gmail.com', b'1', '$2a$10$cQqEZdc3ogRN73V8HNB5ruYevCVpu91nSjXRgxqj81/pcg7V2Ptju', b'0', NULL, 'ahmed.toufik@gmail.com', NULL, '', ''),
(3, 'anonymousUser', '2023-08-21 22:26:16', NULL, NULL, b'1', b'1', NULL, b'1', 'test-ref@gmail.com', b'1', '$2a$10$Go8meiZG0ae3bIm4kkOCROILGOGjzvHTx4xbdfav3AwdPzPJICueO', b'0', NULL, 'test-ref@gmail.com', NULL, '', '');

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`date_naissance`, `nom`, `prenom`, `telephone`, `id`, `action_type`, `data`, `date`, `object_id`, `object_name`, `user_id`, `username`, `entite_administrative`, `gender`) VALUES
('2023-08-20 22:00:00', 'ABDELGHANI LIDRISSI', 'Hamid', '0602597099', 152, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 1),
('2023-08-08 22:00:00', 'Zouani', 'Youness', '641676176', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 1),
('2023-08-21 22:10:14', 'Toufik', 'Ahmed', '0734567890', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 1),
('2023-08-21 22:25:23', 'User', 'Test', '641676176', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 8, 1);

--
-- Déchargement des données de la table `utilisateur_seq`
--

INSERT INTO `utilisateur_seq` (`next_val`) VALUES
(1),
(1),
(1);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
