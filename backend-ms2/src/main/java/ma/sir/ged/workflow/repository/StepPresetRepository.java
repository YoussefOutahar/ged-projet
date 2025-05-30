package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.StepPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StepPresetRepository extends JpaRepository<StepPreset, Long> {
    List<StepPreset> findByWorkflowPresetId(Long id);


}
