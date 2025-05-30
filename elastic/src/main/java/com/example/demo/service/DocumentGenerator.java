package com.example.demo.service;

import com.example.demo.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class DocumentGenerator {
    @Autowired
    private DocumentService documentService;
    private static final Random random = new Random();

    public void generateRandomDocuments(int numDocuments) throws IOException {
        List<DocumentFile> documents = new ArrayList<>();
        for (int i = 0; i < numDocuments; i++) {
            DocumentFile document = new DocumentFile();
            document.setId(UUID.randomUUID().toString());
            document.setTitle("Random Title");
            document.setContent("Random Content");
            document.setReferenceGed("Random Ged Reference");
            document.setReference("Random Reference");
            document.setUploadDate(LocalDate.now());
            document.setDateLastUpdate(LocalDate.now());
            document.setFolder(random.nextBoolean());
            document.setSize(random.nextDouble());
            document.setFormat("Random Format");
            document.setDescription("Random Description");
            document.setAnnee(2024L);
            document.setSemstre(random.nextLong());
            document.setMois(12L);
            document.setJour(random.nextLong());
            document.setOcr(random.nextBoolean());
            document.setArchive(random.nextBoolean());
         /*   document.setVersionne(random.nextBoolean());

            document.setDocumentType(generateRandomDocumentType());
            document.setDocumentState(generateRandomDocumentState());
            document.setDocumentCategorie(generateRandomDocumentCategorie());
            document.setUtilisateur(generateRandomUtilisateur());
            document.setEntiteAdministrative(generateRandomEntiteAdministrative());
            document.setDocumentCategorieModel(generateRandomDocumentCategorieModel());*/

            documents.add(document);
            documentService.indexDocument(document);
        }
    }

    private static DocumentTypeDto generateRandomDocumentType() {
        DocumentTypeDto dto = new DocumentTypeDto();
        dto.setCode("code-"+random.nextInt());
        dto.setLibelle("random libelle");
        dto.setDescription("Random Description");
        return dto;
    }

    private static DocumentStateDto generateRandomDocumentState() {
        DocumentStateDto dto = new DocumentStateDto();
        dto.setCode("code-"+random.nextInt());
        dto.setLibelle("Random Libelle");
        dto.setStyle("Random Style");
        dto.setDescription("Random Description");
        return dto;
    }

    private static DocumentCategorieDto generateRandomDocumentCategorie() {
        DocumentCategorieDto dto = new DocumentCategorieDto();
        dto.setCode("code-"+random.nextInt());
        dto.setLibelle("Random Libelle");
        dto.setDescription("Random Description");
        return dto;
    }

    private static UtilisateurDto generateRandomUtilisateur() {
        UtilisateurDto dto = new UtilisateurDto();
        dto.setEmail("email-"+random.nextInt());
        dto.setTelephone("Random Telephone");
        dto.setNom("Random Nom");
        dto.setPrenom("Random Prenom");
        return dto;
    }

    private static EntiteAdministrativeDto generateRandomEntiteAdministrative() {
        EntiteAdministrativeDto dto = new EntiteAdministrativeDto();
        dto.setCode("code-"+random.nextInt());
        dto.setReferenceGed("Random Ged Reference");
        dto.setDescription("Random Description");
        dto.setLibelle("Random Libelle");
        dto.setEntiteAdministrativeParent(null);
        dto.setChef(generateRandomUtilisateur());
        dto.setEntiteAdministrativeType(generateRandomEntiteAdministrativeType());
        // You can generate the utilisateurs list here
        return dto;
    }

    private static DocumentCategorieModelDto generateRandomDocumentCategorieModel() {
        DocumentCategorieModelDto dto = new DocumentCategorieModelDto();
        dto.setCode("code-"+random.nextInt());
        dto.setLibelle("Random Libelle");
        dto.setReferenceGed("Random Ged Reference");
        dto.setDescription("Random Description");
        dto.setDocumentCategorie(generateRandomDocumentCategorie());
        return dto;
    }

    private static EntiteAdministrativeTypeDto generateRandomEntiteAdministrativeType() {
        EntiteAdministrativeTypeDto dto = new EntiteAdministrativeTypeDto();
        dto.setCode("code-"+random.nextInt());
        dto.setLibelle("Random Libelle");
        dto.setDescription("Random Description");
        return dto;
    }
}

