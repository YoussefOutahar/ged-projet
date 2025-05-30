package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.STEP_STATUS;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Data
public class Step extends AuditBusinessObject {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "step_preset_id")
    private StepPreset stepPreset;

    @Enumerated(EnumType.STRING)
    @Column(name = "Statu")
    private STEP_STATUS status;

    @ElementCollection(targetClass = ACTION.class)
    @Enumerated
    private List<ACTION> actions;

    private LocalDateTime validateDate;

    @JsonManagedReference
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "step_destinataire",
            joinColumns = @JoinColumn(name = "step_id"),
            inverseJoinColumns = @JoinColumn(name = "destinataire_id")
    )
    private List<UserDestinataire> destinataires;



    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "step_document",
            joinColumns = @JoinColumn(name = "step_id"),
            inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    @JsonManagedReference
    private List<Document> documents;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "step_document_action",
            joinColumns = @JoinColumn(name = "step_id"),
            inverseJoinColumns = @JoinColumn(name = "document_id")
    )
    private List<Document> documentsActions;



    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id")
    @JsonBackReference
    private Workflow workflow;

    @JsonManagedReference
    @OneToMany(mappedBy = "step", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Commentaire> discussions;

    @Override
    public String toString() {
        return "Step{" +
                "id=" + id +
                ", status=" + status +
                '}';
    }

}
