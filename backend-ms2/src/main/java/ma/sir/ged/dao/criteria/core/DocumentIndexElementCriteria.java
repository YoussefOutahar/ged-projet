package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;

public class DocumentIndexElementCriteria extends  BaseCriteria  {

    private String value;
    private String valueLike;
    private String description;
    private String descriptionLike;

    private IndexElementCriteria indexElement ;
    private List<IndexElementCriteria> indexElements ;
    private DocumentCriteria document ;
    private List<DocumentCriteria> documents ;


    public DocumentIndexElementCriteria(){}

    public String getValue(){
        return this.value;
    }
    public void setValue(String value){
        this.value = value;
    }
    public String getValueLike(){
        return this.valueLike;
    }
    public void setValueLike(String valueLike){
        this.valueLike = valueLike;
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
    public DocumentCriteria getDocument(){
        return this.document;
    }

    public void setDocument(DocumentCriteria document){
        this.document = document;
    }
    public List<DocumentCriteria> getDocuments(){
        return this.documents;
    }

    public void setDocuments(List<DocumentCriteria> documents){
        this.documents = documents;
    }
}
