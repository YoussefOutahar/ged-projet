package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.Visibilite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VisibiliteRepository extends JpaRepository<Visibilite, Long> {
    List<Visibilite> findByWorkflowId(Long workflowId);
}
