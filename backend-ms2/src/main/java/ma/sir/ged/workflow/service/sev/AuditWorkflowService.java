package ma.sir.ged.workflow.service.sev;


import ma.sir.ged.workflow.DTO.AuditWorkflowDto;
import ma.sir.ged.workflow.entity.AuditWorkflow;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface AuditWorkflowService {

    AuditWorkflow create(AuditWorkflowDto auditDto);
    AuditWorkflow saveAudit(Long workflowId, String action);
    List<AuditWorkflow> getAll();
    Page<AuditWorkflow> getAll(int page, int size);
    List<AuditWorkflow> findAuditByWorkflow(Long idWorkflow);
    List<AuditWorkflow> findAuditByUtilisateur(Long idUtilisateur);
    List<AuditWorkflow> findAuditByAction(String action);
    int deleteByWorkflowId(Long id);
    List<String> returnActions();
    List<Map<String, Map<String, Integer>>> getAuditStats();
}
