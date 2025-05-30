package com.example.demo.criteria;


public class EntiteAdministrativeCriteria extends BaseCriteria {

    private String code;
    private String codeLike;
    private String referenceGed;
    private String referenceGedLike;
    private String description;
    private String descriptionLike;
    private String libelle;
    private String libelleLike;


    public EntiteAdministrativeCriteria() {
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getCodeLike() {
        return this.codeLike;
    }

    public void setCodeLike(String codeLike) {
        this.codeLike = codeLike;
    }

    public String getReferenceGed() {
        return this.referenceGed;
    }

    public void setReferenceGed(String referenceGed) {
        this.referenceGed = referenceGed;
    }

    public String getReferenceGedLike() {
        return this.referenceGedLike;
    }

    public void setReferenceGedLike(String referenceGedLike) {
        this.referenceGedLike = referenceGedLike;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescriptionLike() {
        return this.descriptionLike;
    }

    public void setDescriptionLike(String descriptionLike) {
        this.descriptionLike = descriptionLike;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getLibelleLike() {
        return this.libelleLike;
    }

    public void setLibelleLike(String libelleLike) {
        this.libelleLike = libelleLike;
    }



    @Override
    public String getCodeValue() {
        return libelle;
    }
}
