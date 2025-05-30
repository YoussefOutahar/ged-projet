package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.workflow.DTO.SignedCertPerWorkflowDTO;
import ma.sir.ged.workflow.DTO.WorkflowKPIDto;
import ma.sir.ged.workflow.DTO.WorkflowStepKPIDto;
import ma.sir.ged.workflow.DTO.WorkflowWithDurationDto;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;

import java.util.List;

public interface WorkFlowKPIService {


    Long count();
    Long countWorkflowsByStatus(WorkflowStatus status);
    Long countWorkflowsByStatusAndInitiateur(WorkflowStatus status, Long initiateurId);

    Long countWorkflowsByFlag(Flag flag);
    Long findWorkflowByInitiateurId(Long id);

    Long countWorkflowsByFlagAndInitiateur(Long id, Flag flag);

    List<SignedCertPerWorkflowDTO> countSignedCertPerWorkflow();
    List<WorkflowWithDurationDto> extraireDureesFinWorkflowParPreset(WorkflowPreset workflowPreset);
    List<WorkflowStepKPIDto> extraireTop3StepsLentesParWorkflowPreset(WorkflowPreset workflowPreset);
    List<WorkflowStepKPIDto> extraireTop3StepsRapidesParWorkflowPreset(WorkflowPreset workflowPreset);
    List<WorkflowKPIDto> getWorkflowKPIDto();
    List<WorkflowKPIDto> getWorkflowKPIDtoByTitle(String title);
}
