package ma.sir.ged.bean.core.referentielpartage;

import java.util.Objects;

import java.time.LocalDateTime;


import com.fasterxml.jackson.annotation.JsonInclude;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;


@Entity
@Table(name = "document_partage_utilisateur")
@JsonInclude(JsonInclude.Include.NON_NULL)
@SequenceGenerator(name="document_partage_utilisateur_seq",sequenceName="document_partage_utilisateur_seq",allocationSize=1, initialValue = 1)
public class DocumentPartageUtilisateur   extends AuditBusinessObject     {

    private Long id;

    private LocalDateTime dateShare ;
    @Column(length = 500)
    private String description;

    private Document document ;
    
    private Utilisateur utilisateur ;
    
    private AccessShare accessShare ;
    


    public DocumentPartageUtilisateur(){
        super();
    }





    @Id
    @Column(name = "id")
        @GeneratedValue(strategy = GenerationType.SEQUENCE,generator="document_partage_utilisateur_seq")
    public Long getId(){
        return this.id;
    }
    public void setId(Long id){
        this.id = id;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Document getDocument(){
        return this.document;
    }
    public void setDocument(Document document){
        this.document = document;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public Utilisateur getUtilisateur(){
        return this.utilisateur;
    }
    public void setUtilisateur(Utilisateur utilisateur){
        this.utilisateur = utilisateur;
    }
    public LocalDateTime getDateShare(){
        return this.dateShare;
    }
    public void setDateShare(LocalDateTime dateShare){
        this.dateShare = dateShare;
    }
    @ManyToOne(fetch = FetchType.LAZY)
    public AccessShare getAccessShare(){
        return this.accessShare;
    }
    public void setAccessShare(AccessShare accessShare){
        this.accessShare = accessShare;
    }
    public String getDescription(){
        return this.description;
    }
    public void setDescription(String description){
        this.description = description;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DocumentPartageUtilisateur documentPartageUtilisateur = (DocumentPartageUtilisateur) o;
        return id != null && id.equals(documentPartageUtilisateur.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

}

