package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.bean.core.parapheur.ParapheurBo;
import ma.sir.ged.workflow.DTO.WorkflowDTO;
import ma.sir.ged.workflow.entity.Step;
import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.ParapheurDto;
import org.springframework.data.domain.Page;

import java.util.List;


public interface WorkflowService {

     Workflow createWorkflow(WorkflowDTO workflowDTO) throws Exception;
     WorkflowDTO getWorkflowById(Long id);
     List<DocumentDto> getAllDocumentsActionsFromWorkflow(Long workflowId);
     List<WorkflowDTO> getAllWorkflows();

     Workflow updateWorkflow(WorkflowDTO workflowDTO) throws Exception;

    WorkflowDTO annulerWorkflow(Long id);
    WorkflowDTO reouvrirWorkflow(Long id);
    WorkflowDTO closeWorkflow(Long id);
    void deleteWorkflow(Long id);

    List<WorkflowDTO> gewWorkflowByInitiateurId(Long id , WorkflowStatus status);
    Step findStepWithParapherAction(List<Step> steps, ACTION action);
    Page<WorkflowDTO> getWorkflowByInitiateurId(Long id,WorkflowStatus status , int page , int size);

    void associateParapheurWithWorkflow(Long parapheurBoId, Long workflowId);
    void generateAndAddFicheParapheur(Long workflowId, Long currentStepId);
    void generateAndAddFicheParapheur(Long parapheurId, Long workflowId, Long currentStepId);
    ParapheurBo getLastParapheurForWorkflow(Long workflowId);

    void parapher(long workflowId,long currentStepId) throws Exception;
    Workflow getWorkflowByParapheurId(Long parapheurId);
    WorkflowDTO addPVToWorkflow(Long workflowId, List<DocumentDto> dtos);

    List<ParapheurDto> getParapheursByWorkflowId(Long workflowId);

    List<DocumentDto> getSignedCEByWorkflowId(Long id);
}
