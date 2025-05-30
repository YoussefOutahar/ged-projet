package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;

public class DocumentCategorieModelCriteria extends  BaseCriteria  {

    private String code;
    private String codeLike;
    private String libelle;
    private String libelleLike;
    private String referenceGed;
    private String referenceGedLike;
    private String description;
    private String descriptionLike;

    private DocumentCategorieCriteria documentCategorie ;
    private List<DocumentCategorieCriteria> documentCategories ;


    public DocumentCategorieModelCriteria(){}

    public String getCode(){
        return this.code;
    }
    public void setCode(String code){
        this.code = code;
    }
    public String getCodeLike(){
        return this.codeLike;
    }
    public void setCodeLike(String codeLike){
        this.codeLike = codeLike;
    }

    public String getLibelle(){
        return this.libelle;
    }
    public void setLibelle(String libelle){
        this.libelle = libelle;
    }
    public String getLibelleLike(){
        return this.libelleLike;
    }
    public void setLibelleLike(String libelleLike){
        this.libelleLike = libelleLike;
    }

    public String getReferenceGed(){
        return this.referenceGed;
    }
    public void setReferenceGed(String referenceGed){
        this.referenceGed = referenceGed;
    }
    public String getReferenceGedLike(){
        return this.referenceGedLike;
    }
    public void setReferenceGedLike(String referenceGedLike){
        this.referenceGedLike = referenceGedLike;
    }

    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }
    public String getDescriptionLike(){
        return this.descriptionLike;
    }
    public void setDescriptionLike(String descriptionLike){
        this.descriptionLike = descriptionLike;
    }


    public DocumentCategorieCriteria getDocumentCategorie(){
        return this.documentCategorie;
    }

    public void setDocumentCategorie(DocumentCategorieCriteria documentCategorie){
        this.documentCategorie = documentCategorie;
    }
    public List<DocumentCategorieCriteria> getDocumentCategories(){
        return this.documentCategories;
    }

    public void setDocumentCategories(List<DocumentCategorieCriteria> documentCategories){
        this.documentCategories = documentCategories;
    }
}
