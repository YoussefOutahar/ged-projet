package ma.sir.ged.workflow.mapper;

import lombok.Data;
import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.repository.StepPresetRepository;
import ma.sir.ged.workflow.repository.WFPresetRepository;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Component
@Data
public class StepPresetDTOMapper {


    private final WFPresetRepository wfPresetRepository;
    private final StepPresetRepository stepPresetRepository;
    private final UserDestinataireDTOMapper userDestinataireDTOMapper;



    public  StepPresetDTO mapToDto(StepPreset stepPreset) {
        StepPresetDTO stepPresetDTO = new StepPresetDTO();
        stepPresetDTO.setId(stepPreset.getId());
        stepPresetDTO.setTitle(stepPreset.getTitle());
        stepPresetDTO.setLevel(stepPreset.getLevel());
        stepPresetDTO.setDescription(stepPreset.getDescription());
        stepPresetDTO.setWorkflowPresetId(stepPreset.getWorkflowPreset().getId());
        stepPresetDTO.setActions(stepPreset.getActions());
        stepPresetDTO.setAddPV(stepPreset.isAddPV());
        if (stepPreset.getDuration() != null) {
            stepPresetDTO.setDuration(stepPreset.getDuration());
        }
        stepPresetDTO.setDestinataires(userDestinataireDTOMapper.mapUserDestinatairesToDTOs(stepPreset.getDestinataires()));
        return stepPresetDTO;
    }

    public  StepPreset mapToEntity(StepPresetDTO stepPresetDTO) {
        StepPreset stepPreset = new StepPreset();
        stepPreset.setId(stepPresetDTO.getId());
        stepPreset.setTitle(stepPresetDTO.getTitle());
        stepPreset.setLevel(stepPresetDTO.getLevel());
        stepPreset.setDescription(stepPresetDTO.getDescription());
        stepPreset.setActions(stepPresetDTO.getActions());
        stepPreset.setAddPV(stepPresetDTO.isAddPV());
        if (stepPresetDTO.getDuration() != null) {
            stepPreset.setDuration(stepPresetDTO.getDuration());
        }
        WorkflowPreset workflowPreset = wfPresetRepository.findById(stepPresetDTO.getWorkflowPresetId())
                .orElseThrow(() -> new EntityNotFoundException("Error in StepPresetDTOMapper.  WorkflowPreset not found with id: " + stepPresetDTO.getWorkflowPresetId()));

        stepPreset.setWorkflowPreset(workflowPreset);

        return stepPreset;
    }



    public List<StepPresetDTO> mapListToDto(List<StepPreset> stepPresets) {
        return stepPresets.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<StepPreset> mapToEntities(List<StepPresetDTO> stepPresetDTOs) {
        return stepPresetDTOs.stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());
    }


    public  StepPreset mapToEntityinsave(StepPresetDTO stepPresetDTO,WorkflowPreset workflowPreset) {
        StepPreset stepPreset = new StepPreset();
        stepPreset.setId(stepPresetDTO.getId());
        stepPreset.setTitle(stepPresetDTO.getTitle());
        stepPreset.setLevel(stepPresetDTO.getLevel());
        stepPreset.setDescription(stepPresetDTO.getDescription());
        stepPreset.setActions(stepPresetDTO.getActions());

        stepPreset.setWorkflowPreset(workflowPreset);

        return stepPreset;
    }


    public List<StepPreset> mapToEntityListInSave(List<StepPresetDTO> stepPresetDTOList, WorkflowPreset workflowPreset) {
        List<StepPreset> stepPresetList = new ArrayList<>();
        if (stepPresetDTOList == null) {
            return stepPresetList ;
        }

        for (StepPresetDTO stepPresetDTO : stepPresetDTOList) {
            StepPreset stepPreset = new StepPreset();
            /*stepPreset.setId(stepPresetDTO.getId());*/
            stepPreset.setTitle(stepPresetDTO.getTitle());
            stepPreset.setLevel(stepPresetDTO.getLevel());
            stepPreset.setDuration(stepPresetDTO.getDuration());
            stepPreset.setDescription(stepPresetDTO.getDescription());
            stepPreset.setActions(stepPresetDTO.getActions());
            stepPreset.setAddPV(stepPresetDTO.isAddPV());
            stepPreset.setDestinataires( userDestinataireDTOMapper.mapToEntityListInSave(stepPresetDTO.getDestinataires(),stepPreset));
            // Associe le WorkflowPreset fourni à chaque StepPreset
            stepPreset.setWorkflowPreset(workflowPreset);
            stepPresetList.add(stepPreset);
        }

        return stepPresetList;
    }


}
