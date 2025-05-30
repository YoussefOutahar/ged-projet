package  ma.sir.ged.dao.criteria.core;


import ma.sir.ged.zynerator.criteria.BaseCriteria;
import java.util.List;
import java.time.LocalDateTime;
import java.time.LocalDate;

public class DocumentPartageGroupeCriteria extends  BaseCriteria  {

    private LocalDateTime dateShare;
    private LocalDateTime dateShareFrom;
    private LocalDateTime dateShareTo;
    private String description;
    private String descriptionLike;

    private DocumentCriteria document ;
    private List<DocumentCriteria> documents ;
    private GroupeCriteria groupe ;
    private List<GroupeCriteria> groupes ;
    private AccessShareCriteria accessShare ;
    private List<AccessShareCriteria> accessShares ;


    public DocumentPartageGroupeCriteria(){}

    public LocalDateTime getDateShare(){
        return this.dateShare;
    }
    public void setDateShare(LocalDateTime dateShare){
        this.dateShare = dateShare;
    }
    public LocalDateTime getDateShareFrom(){
        return this.dateShareFrom;
    }
    public void setDateShareFrom(LocalDateTime dateShareFrom){
        this.dateShareFrom = dateShareFrom;
    }
    public LocalDateTime getDateShareTo(){
        return this.dateShareTo;
    }
    public void setDateShareTo(LocalDateTime dateShareTo){
        this.dateShareTo = dateShareTo;
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
    public GroupeCriteria getGroupe(){
        return this.groupe;
    }

    public void setGroupe(GroupeCriteria groupe){
        this.groupe = groupe;
    }
    public List<GroupeCriteria> getGroupes(){
        return this.groupes;
    }

    public void setGroupes(List<GroupeCriteria> groupes){
        this.groupes = groupes;
    }
    public AccessShareCriteria getAccessShare(){
        return this.accessShare;
    }

    public void setAccessShare(AccessShareCriteria accessShare){
        this.accessShare = accessShare;
    }
    public List<AccessShareCriteria> getAccessShares(){
        return this.accessShares;
    }

    public void setAccessShares(List<AccessShareCriteria> accessShares){
        this.accessShares = accessShares;
    }
}
