package ma.sir.ged.workflow.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ma.sir.ged.bean.core.bureauOrdre.CourrielBo;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import javax.persistence.*;

import java.util.List;


@Entity
@Data
public class Workflow extends AuditBusinessObject {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private String description;

    private WorkflowStatus status;

    private Flag flag;

    private int documentCount;

    @OneToMany(mappedBy = "workflow" , cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Step> stepList;


    @ManyToOne
    private WorkflowPreset workflowPreset;


    @OneToOne
    @JoinColumn(name = "initiateur_id")
    private  Utilisateur initiateur;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "workflow_document",
            joinColumns = @JoinColumn(name = "workflow_id"),
            inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    private List<Document> documents;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "workflow_id")
    private List<Document> piecesJointes;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourrielBo> courrielBos;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ParapheurBo> parapheurBos;

    @Override
    public String toString() {
        return "Workflow{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", status=" + status +
                ", flag=" + flag +
                '}';
    }

}
