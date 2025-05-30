package ma.sir.ged.workflow.repository;

import ma.sir.ged.workflow.entity.AuditWorkflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditWorkflowRepository extends JpaRepository<AuditWorkflow, Long>, JpaSpecificationExecutor<AuditWorkflow> {
    List<AuditWorkflow> findByAction(String action);
    List<AuditWorkflow> findByWorkflowId(Long id);
    List<AuditWorkflow> findByUtilisateurId(Long id);
    int deleteByWorkflowId(Long id);

    @Query("SELECT COUNT(DISTINCT a.action) FROM AuditWorkflow a")
    int countDistinctActions();

    @Query("SELECT a.action, COUNT(DISTINCT a.workflow), COUNT(DISTINCT a.utilisateur) FROM AuditWorkflow a GROUP BY a.action")
    List<Object[]> countDistinctworkflowAndUsersForEachAction();

    @Query("SELECT CONCAT(a.utilisateur.nom, ' ', a.utilisateur.prenom) AS userFullName , a.utilisateur.username, a.workflow.title, COUNT(a) " +
            "FROM AuditWorkflow a " +
            "WHERE a.action = 'Consulter' " +
            "GROUP BY a.utilisateur.id, a.workflow.id " +
            "HAVING COUNT(a) > 10")
    List<Object[]> findUsersAndDocumentsConsultedMoreThanTenTimes();

}
