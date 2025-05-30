package com.example.demo.criteria;

import com.example.demo.config.LocalDateTimeDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class DocumentCriteria {
    private String reference;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDate uploadDate;
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    private LocalDate dateLastUpdate;
    private String referenceGed;
    private String referenceLike;
    private String referenceGedLike;
    private LocalDate uploadDateFrom;
    private LocalDate uploadDateTo;
    private String annee;
    private String anneeMin;
    private String anneeMax;
    private String semstre;
    private String semstreMin;
    private String semstreMax;
    private String mois;
    private String moisMin;
    private String moisMax;
    private String jour;
    private String jourMin;
    private String jourMax;
    private Boolean ocr;
    private String content;
    private String contentLike;
    private String size;
    private String sizeMin;
    private String sizeMax;
    private Boolean archive;
    private Boolean versionne;


    private DocumentStateCriteria documentType;
    private DocumentStateCriteria documentState;
    private DocumentCategorieCriteria documentCategorie;
    private UtilisateurCriteria utilisateur;
    private EntiteAdministrativeCriteria entiteAdministrative;
    private DocumentCategorieCriteria documentCategorieModel;




}




