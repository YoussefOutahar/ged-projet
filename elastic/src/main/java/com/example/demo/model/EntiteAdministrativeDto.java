package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonInclude;


import java.util.List;


@JsonInclude(JsonInclude.Include.NON_NULL)
public class EntiteAdministrativeDto  extends AuditBaseDto {

    private String code  ;
    private String referenceGed  ;
    private String description  ;
    private String libelle  ;

    private EntiteAdministrativeDto entiteAdministrativeParent ;
    private UtilisateurDto chef ;
    private EntiteAdministrativeTypeDto entiteAdministrativeType ;

    private List<UtilisateurDto> utilisateurs ;


    public EntiteAdministrativeDto(){
        super();
    }




    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
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


    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }


    public EntiteAdministrativeDto getEntiteAdministrativeParent(){
        return this.entiteAdministrativeParent;
    }

    public void setEntiteAdministrativeParent(EntiteAdministrativeDto entiteAdministrativeParent){
        this.entiteAdministrativeParent = entiteAdministrativeParent;
    }
    public UtilisateurDto getChef(){
        return this.chef;
    }

    public void setChef(UtilisateurDto chef){
        this.chef = chef;
    }
    public EntiteAdministrativeTypeDto getEntiteAdministrativeType(){
        return this.entiteAdministrativeType;
    }

    public void setEntiteAdministrativeType(EntiteAdministrativeTypeDto entiteAdministrativeType){
        this.entiteAdministrativeType = entiteAdministrativeType;
    }



    public List<UtilisateurDto> getUtilisateurs(){
        return this.utilisateurs;
    }

    public void setUtilisateurs(List<UtilisateurDto> utilisateurs){
        this.utilisateurs = utilisateurs;
    }



}
