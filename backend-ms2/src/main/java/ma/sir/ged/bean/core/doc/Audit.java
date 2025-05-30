package ma.sir.ged.bean.core.doc;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="audit_seq",sequenceName="audit_seq",allocationSize=1, initialValue = 1)
public class Audit extends AuditBusinessObject {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="audit_seq")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"entiteAdministrative","roles","authorities","gender"})
    private Utilisateur utilisateur ;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"utilisateur","entiteAdministrative","documentCategorie","documentState","documentType","documentCategorieModel","documentIndexElements","documentPartageGroupes","documentPartageUtilisateurs"})
    private Document document;
    @Column
    private String action;
    @Column
    private LocalDateTime uploadDate ;


    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
}
