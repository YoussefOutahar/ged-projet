package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.Workflow;
import ma.sir.ged.workflow.entity.WorkflowPreset;
import ma.sir.ged.workflow.entity.enums.ACTION;
import ma.sir.ged.workflow.entity.enums.Flag;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow,Long> {

    List<Workflow> findWorkflowByInitiateurIdAndStatus(Long id,WorkflowStatus status ,Sort sort);
    List<Workflow> findWorkflowByInitiateurId(Long id);
    Page<Workflow> findWorkflowByInitiateurIdAndStatus(Long id,WorkflowStatus status, Pageable pageable);

    List<Workflow> findByWorkflowPresetIdAndStatus(Long id,WorkflowStatus status,Sort sort);
    List<Workflow> findWorkflowByStatus(WorkflowStatus status, Sort sort);

    @Query("SELECT COUNT(w) FROM Workflow w WHERE w.status = :status")
    Long countWorkflowsByStatus(@Param("status") WorkflowStatus status);


    @Query("SELECT COUNT(w) FROM Workflow w WHERE w.status = :status AND w.initiateur.id = :id")
    Long countWorkflowsByStatusAndInitiateur(@Param("status") WorkflowStatus status, @Param("id") Long id);

    @Query("SELECT COUNT(w) FROM Workflow w WHERE w.flag = :flag")
    Long countWorkflowsByFlag(@Param("flag")Flag flag);

    List<Workflow> findWorkflowByInitiateurIdAndAndFlag(Long id, Flag flag);
    List<Workflow> findWorkflowByWorkflowPresetAndStatus(WorkflowPreset workflowPreset, WorkflowStatus status);


    @Query("SELECT w FROM Workflow  w  join w.stepList s join s.actions a WHERE w.status != :workflowStatus and a = :stepStatus")
    List<Workflow> findAllNotClotureAndHasSignAction(@Param("workflowStatus") WorkflowStatus workflowStatus , @Param("stepStatus") ACTION stepStatus);

    @Query("SELECT w FROM Workflow w JOIN w.parapheurBos p WHERE p.id = :parapheurId")
    Workflow findByParapheurId(@Param("parapheurId") Long parapheurId);

    @Query("SELECT DISTINCT w FROM Workflow w " +
            "LEFT JOIN w.documents d " +
            "LEFT JOIN w.stepList s " +
            "LEFT JOIN s.documents sd " +
            "WHERE d.id = :documentId OR sd.id = :documentId")
    List<Workflow> findByDocumentIdInWorkflowOrSteps(@Param("documentId") Long documentId);

    @Query("SELECT w FROM Workflow w JOIN w.documents d WHERE d.id = :documentId")
    List<Workflow> findByDocumentId(@Param("documentId") Long documentId);

    @Query("SELECT w FROM Workflow w JOIN w.stepList s JOIN s.documents sd WHERE sd.id = :documentId")
    List<Workflow> findByDocumentIdInSteps(@Param("documentId") Long documentId);

    @Query("SELECT w FROM Workflow w WHERE LOWER(w.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Workflow> findByTitleContaining(@Param("keyword") String keyword);

    List<Workflow> findWorkflowByStatusIn(List<WorkflowStatus> statuses, Sort sort);

}
