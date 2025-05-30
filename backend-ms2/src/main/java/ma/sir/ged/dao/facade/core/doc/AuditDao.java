package ma.sir.ged.dao.facade.core.doc;

import ma.sir.ged.bean.core.doc.Audit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditDao extends JpaRepository<Audit, Long>, JpaSpecificationExecutor<Audit> {

    List<Audit> findByAction(String action);
    List<Audit> findByDocumentId(Long id);
    List<Audit> findByUtilisateurId(Long id);
    int deleteByDocumentId(Long id);

    @Query("SELECT COUNT(DISTINCT a.action) FROM Audit a")
    int countDistinctActions();

    @Query("SELECT a.action, COUNT(DISTINCT a.document), COUNT(DISTINCT a.utilisateur) FROM Audit a GROUP BY a.action")
    List<Object[]> countDistinctDocumentsAndUsersForEachAction();

    @Query("SELECT CONCAT(a.utilisateur.nom, ' ', a.utilisateur.prenom) AS userFullName , a.utilisateur.username, a.document.reference, COUNT(a) " +
            "FROM Audit a " +
            "WHERE a.action = 'Consulter' " +
            "GROUP BY a.utilisateur.id, a.document.id " +
            "HAVING COUNT(a) > 10")
    List<Object[]> findUsersAndDocumentsConsultedMoreThanTenTimes();
}
