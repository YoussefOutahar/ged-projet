package ma.sir.ged.workflow.service.sev;
import ma.sir.ged.workflow.DTO.WorkflowPresetDTO;
import ma.sir.ged.workflow.entity.WorkflowPreset;

import java.util.List;

public interface WFPresetService {

    WorkflowPresetDTO createWorkflowPreset(WorkflowPresetDTO workflow);
    WorkflowPresetDTO getWorkflowPresetById(Long id);

    List<WorkflowPreset> getAllWorkflowPresets();
    List<WorkflowPresetDTO> getAllWorkflowPresetsByEntite(String libelle);

    WorkflowPresetDTO updateWorkflowPreset(WorkflowPresetDTO workflow);


    void deleteWorkflowPreset(Long id);
}
