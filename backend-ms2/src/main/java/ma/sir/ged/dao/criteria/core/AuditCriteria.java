package ma.sir.ged.dao.criteria.core;

import ma.sir.ged.zynerator.criteria.BaseCriteria;

import java.util.List;

public class AuditCriteria  extends BaseCriteria {

    private UtilisateurCriteria utilisateur ;
    private List<UtilisateurCriteria> utilisateurs ;
    private DocumentCriteria document ;
    private List<DocumentCriteria> documents ;

    private String action;
    private String actionLike;

    public AuditCriteria() {
    }

    public UtilisateurCriteria getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(UtilisateurCriteria utilisateur) {
        this.utilisateur = utilisateur;
    }

    public DocumentCriteria getDocument() {
        return document;
    }

    public void setDocument(DocumentCriteria document) {
        this.document = document;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActionLike() {
        return actionLike;
    }

    public void setActionLike(String actionLike) {
        this.actionLike = actionLike;
    }

    public List<UtilisateurCriteria> getUtilisateurs() {
        return utilisateurs;
    }

    public void setUtilisateurs(List<UtilisateurCriteria> utilisateurs) {
        this.utilisateurs = utilisateurs;
    }

    public List<DocumentCriteria> getDocuments() {
        return documents;
    }

    public void setDocuments(List<DocumentCriteria> documents) {
        this.documents = documents;
    }
}
