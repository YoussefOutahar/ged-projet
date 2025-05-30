package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonInclude;



@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentCategorieModelDto extends AuditBaseDto {

    private String code  ;
    private String libelle  ;
    private String referenceGed  ;
    private String description  ;

    private DocumentCategorieDto documentCategorie ;



    public DocumentCategorieModelDto(){
        super();
    }




    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }


    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }


    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }


    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    public DocumentCategorieDto getDocumentCategorie(){
        return this.documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieDto documentCategorie){
        this.documentCategorie = documentCategorie;
    }






}
