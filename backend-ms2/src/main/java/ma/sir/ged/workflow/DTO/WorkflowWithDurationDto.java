package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import ma.sir.ged.workflow.entity.Workflow;

@Data
@AllArgsConstructor
public class WorkflowWithDurationDto {
    private Long id;
    private String title;
    private String duration;
}
