package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonInclude;


import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentCategorieDto  extends AuditBaseDto {

    private String code  ;
    private String libelle  ;
    private String description  ;



    public DocumentCategorieDto(){
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


    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    



}
