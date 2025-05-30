package ma.sir.ged.workflow.DTO;

import lombok.Data;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.time.LocalDateTime;

@Data
public class AuditWorkflowDto extends AuditBaseDto {
    private Long id;
    private Long utilisateurId;
    private Long workflowId;
    private String action;
    private LocalDateTime uploadDate ;
}
