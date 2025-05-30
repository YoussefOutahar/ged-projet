package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.WorkflowPreset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WFPresetRepository extends JpaRepository<WorkflowPreset,Long> {

}
