package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;

public class DocumentCategorieIndexCriteria extends  BaseCriteria  {


    private IndexElementCriteria indexElement ;
    private List<IndexElementCriteria> indexElements ;
    private DocumentCategorieCriteria documentCategorie ;
    private List<DocumentCategorieCriteria> documentCategories ;
    private DocumentCategorieIndexRuleCriteria documentCategorieIndexRule ;
    private List<DocumentCategorieIndexRuleCriteria> documentCategorieIndexRules ;


    public DocumentCategorieIndexCriteria(){}


    public IndexElementCriteria getIndexElement(){
        return this.indexElement;
    }

    public void setIndexElement(IndexElementCriteria indexElement){
        this.indexElement = indexElement;
    }
    public List<IndexElementCriteria> getIndexElements(){
        return this.indexElements;
    }

    public void setIndexElements(List<IndexElementCriteria> indexElements){
        this.indexElements = indexElements;
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
    public DocumentCategorieIndexRuleCriteria getDocumentCategorieIndexRule(){
        return this.documentCategorieIndexRule;
    }

    public void setDocumentCategorieIndexRule(DocumentCategorieIndexRuleCriteria documentCategorieIndexRule){
        this.documentCategorieIndexRule = documentCategorieIndexRule;
    }
    public List<DocumentCategorieIndexRuleCriteria> getDocumentCategorieIndexRules(){
        return this.documentCategorieIndexRules;
    }

    public void setDocumentCategorieIndexRules(List<DocumentCategorieIndexRuleCriteria> documentCategorieIndexRules){
        this.documentCategorieIndexRules = documentCategorieIndexRules;
    }
}
