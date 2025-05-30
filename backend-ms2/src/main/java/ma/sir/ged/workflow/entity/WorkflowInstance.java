package ma.sir.ged.workflow.entity;

import lombok.Data;
import ma.sir.ged.workflow.entity.enums.WFStatus;

import javax.persistence.*;
import java.util.Optional;

@Entity
@Data
public class WorkflowInstance {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private WFStatus status;

    @ManyToOne
    @JoinColumn(name = "workflow_id")
    private Workflow workflow;



    public void setWorkflow(Optional<Workflow> workflow) {
        this.workflow = workflow.orElse(null);
    }


}
