package ma.sir.ged.workflow.service.imp;

import lombok.Data;
import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.entity.StepPreset;
import ma.sir.ged.workflow.exceptions.EntityNotFoundException;
import ma.sir.ged.workflow.mapper.StepPresetDTOMapper;
import ma.sir.ged.workflow.repository.StepPresetRepository;
import ma.sir.ged.workflow.service.sev.StepPresetService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Data
public class StepPresetServiceImp implements StepPresetService {

    private final StepPresetRepository stepPresetRepository;
    private final StepPresetDTOMapper stepPresetDTOMapper;

    public StepPresetDTO createStepPreset(StepPresetDTO stepPresetDTO) {
        StepPreset stepPreset = stepPresetDTOMapper.mapToEntity(stepPresetDTO);
        StepPreset createdStepPreset = stepPresetRepository.save(stepPreset);
        return stepPresetDTOMapper.mapToDto(createdStepPreset);
    }

    public List<StepPresetDTO> createStepPresetsAll(List<StepPresetDTO> stepPresetDTOListDTO) {
        List<StepPreset> stepPresets = stepPresetDTOMapper.mapToEntities(stepPresetDTOListDTO);
        List<StepPreset> createdStepPreset = stepPresetRepository.saveAll(stepPresets);
        return stepPresetDTOMapper.mapListToDto(createdStepPreset);
    }

    public StepPresetDTO getStepPresetById(Long id) {
        StepPreset stepPreset = stepPresetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepPreset not found with id: " + id));
        return stepPresetDTOMapper.mapToDto(stepPreset);
    }

    public StepPresetDTO updateStepPreset(Long id, StepPresetDTO updatedStepPresetDTO) {
        StepPreset existingStepPreset = stepPresetRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("StepPreset not found with id: " + id));

        StepPreset updatedStepPreset = stepPresetDTOMapper.mapToEntity(updatedStepPresetDTO);

        existingStepPreset.setTitle(updatedStepPreset.getTitle());
        existingStepPreset.setLevel(updatedStepPreset.getLevel());
        existingStepPreset.setDescription(updatedStepPreset.getDescription());
        existingStepPreset.setActions(updatedStepPreset.getActions());
        existingStepPreset.setDestinataires(updatedStepPreset.getDestinataires());

        // Update other fields as needed

        StepPreset stepPreset = stepPresetRepository.save(existingStepPreset);
        return stepPresetDTOMapper.mapToDto(stepPreset);
    }

    public void deleteStepPreset(Long id) {
        stepPresetRepository.deleteById(id);
    }

    public List<StepPresetDTO> getAllStepPresets() {
        List<StepPreset> allStepPresets = stepPresetRepository.findAll();
        return allStepPresets.stream()
                .map(stepPresetDTOMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<StepPresetDTO> getStepPeresetswithIdWorkflow(Long id) {

        List<StepPreset> stepPresetList = stepPresetRepository.findByWorkflowPresetId(id);

        if(stepPresetList.isEmpty()){
        }
        return  stepPresetDTOMapper.mapListToDto(stepPresetList);
    }

}
