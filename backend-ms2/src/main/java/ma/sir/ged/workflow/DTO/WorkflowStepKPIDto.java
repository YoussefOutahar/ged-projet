package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WorkflowStepKPIDto {
    private String workflowId;
    private String stepName;
    private String duree;
    private String evaluation;
}
