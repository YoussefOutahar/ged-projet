package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
public class AuditWorkflow extends AuditBusinessObject {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"entiteAdministrative","roles","authorities","gender","signature","profilePicture"})
    private Utilisateur utilisateur ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"workflowPreset", "documents", "stepList", "piecesJointes"})
    private Workflow workflow;

    @Column
    private String action;
    @Column
    private LocalDateTime uploadDate;
}
