package ma.sir.ged.workflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import ma.sir.ged.bean.core.organigramme.Utilisateur;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
public class WorkflowPreset extends AuditBusinessObject {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private String description;

    private boolean suppression ;

    @JsonManagedReference
    @JsonIgnore
    @OneToMany(mappedBy = "workflowPreset", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StepPreset> stepPresetList ;



    @OneToOne
    @JoinColumn(name = "createur_id", referencedColumnName = "id")
    private Utilisateur createur;



}
