package ma.sir.ged.workflow.service.sev;

import ma.sir.ged.workflow.DTO.StepPresetDTO;
import ma.sir.ged.workflow.entity.StepPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface StepPresetService {
    StepPresetDTO createStepPreset(StepPresetDTO stepPresetDTO);

    StepPresetDTO getStepPresetById(Long id);



    StepPresetDTO updateStepPreset(Long id, StepPresetDTO updatedStepPresetDTO);

    void deleteStepPreset(Long id);

    List<StepPresetDTO> getAllStepPresets();

    List<StepPresetDTO> getStepPeresetswithIdWorkflow(Long id);
}
