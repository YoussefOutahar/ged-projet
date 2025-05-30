package ma.sir.ged.bean.core.parapheur;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurCertificateData;
import ma.sir.ged.bean.core.parapheur.FicheParapheur.ParapheurSignersData;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class ParapheurBo extends AuditBusinessObject {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    @Enumerated(EnumType.STRING)
    private ParapheurEtat parapheurEtat;
    private Boolean deleted;

    @OneToMany
    @JsonManagedReference
    private List<ParapheurComment> comments;

    @OneToOne
    private Document fichParaph;

    @OneToMany
    @JsonIgnore
    private List<ParapheurSignersData> signersData;

    @OneToMany
    @JsonIgnore
    private List<ParapheurCertificateData> parapheurCertificateData;

    @ManyToMany
    @JoinTable(
            name = "parapheur_bo_documents",
            joinColumns = @JoinColumn(name = "parapheur_bo_id"),
            inverseJoinColumns = @JoinColumn(name = "documents")
    )
    private List<Document> documents;

    @ManyToOne(fetch = FetchType.LAZY)
    private Utilisateur utilisateur ;

    @ManyToMany
    @JoinTable(
            name = "parapheur_bo_utilisateurs",
            joinColumns = @JoinColumn(name = "parapheur_bo_id"),
            inverseJoinColumns = @JoinColumn(name = "utilisateur_id")
    )
    private List<Utilisateur> utilisateurs = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "workflow_id")
    @JsonIgnore
    private Workflow workflow;

    @Override
    public String toString() {
        return "ParapheurBo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", parapheurEtat=" + parapheurEtat +
                ", deleted=" + deleted +
                '}';
    }
}
