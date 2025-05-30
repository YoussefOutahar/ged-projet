package ma.sir.ged.dao.facade.core.dashboard;

import ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO;
import ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO;
import ma.sir.ged.ws.dto.dashboard.UserStatsDetailDTO;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DashboardDao {

    @PersistenceContext
    private EntityManager entityManager;

    public List<UserStatsDetailDTO> countUsersByRole() {
        String query = "SELECT new ma.sir.ged.ws.dto.dashboard.UserStatsDetailDTO(ra.label, COUNT(u.id)) " +
                "FROM User u " +
                "LEFT JOIN u.roles ra " +
                "GROUP BY ra.id";
        return entityManager.createQuery(query, UserStatsDetailDTO.class).getResultList();
    }
    public Long countUsers(){
        String query = "SELECT count(*) FROM User u";
        return entityManager.createQuery(query, Long.class).getSingleResult();
    }
    public Long countDocuments(){
        String query = "SELECT count(*) FROM Document d where d.deleted = false";
        return entityManager.createQuery(query, Long.class).getSingleResult();
    }
    public List<AdminEntityStatsDetailDTO> countEntityAdministrative(){
        String query = "SELECT new ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO(e.entiteAdministrativeType.libelle, COUNT(e.id)) " +
                "FROM EntiteAdministrative e " +
                "GROUP BY e.entiteAdministrativeType.libelle";
        return entityManager.createQuery(query, AdminEntityStatsDetailDTO.class).getResultList();
    }

    public List<AdminEntityStatsDetailDTO> countEntityAdministrative(String type) {
        String query = "SELECT new ma.sir.ged.ws.dto.dashboard.AdminEntityStatsDetailDTO(e.entiteAdministrativeType.libelle, COUNT(e.id)) " +
                "FROM EntiteAdministrative e " +
                "WHERE e.entiteAdministrativeType.libelle = :type " +
                "GROUP BY e.entiteAdministrativeType.libelle";

        return entityManager.createQuery(query, AdminEntityStatsDetailDTO.class)
                .setParameter("type", type)
                .getResultList();
    }


    public List<MonthlyDocumentCountDTO> countDocumentsByMonthByUser(int year) {
        String jpqlQuery = "SELECT new ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO(" +
                "d.utilisateur.username, FUNCTION('MONTH', d.createdOn), COUNT(d)) " +
                "FROM Document d " +
                "WHERE FUNCTION('YEAR', d.createdOn) = :year " +
                "AND d.deleted = false " +
                "GROUP BY d.utilisateur.username, FUNCTION('MONTH', d.createdOn)";

        TypedQuery<MonthlyDocumentCountDTO> query = entityManager.createQuery(jpqlQuery, MonthlyDocumentCountDTO.class);
        query.setParameter("year", year);
        return query.getResultList();
    }
    public List<MonthlyDocumentCountDTO> countDocumentsByMonthByUser(int year, String username) {
        List<MonthlyDocumentCountDTO> monthlyStats = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            MonthlyDocumentCountDTO monthlyStat = new MonthlyDocumentCountDTO(username, i, 0);
            monthlyStats.add(monthlyStat);
        }
        String jpqlQuery = "SELECT new ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO(" +
                "d.utilisateur.username, FUNCTION('MONTH', d.createdOn), COUNT(d)) " +
                "FROM Document d " +
                "WHERE FUNCTION('YEAR', d.createdOn) = :year " +
                "AND d.utilisateur.username = :username " +
                "AND d.deleted = false " +
                "GROUP BY d.utilisateur.username, FUNCTION('MONTH', d.createdOn)";

        TypedQuery<MonthlyDocumentCountDTO> query = entityManager.createQuery(jpqlQuery, MonthlyDocumentCountDTO.class);
        query.setParameter("year", year);
        query.setParameter("username", username);
        for (MonthlyDocumentCountDTO stat : query.getResultList()) {
            int month = stat.getMonth();
            monthlyStats.set(month - 1, stat);
        }
        return monthlyStats;
    }

    public List<MonthlyDocumentCountDTO> countDocumentsByMonthByEntiteAdministrative(int year) {
        String jpqlQuery = "SELECT new ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO(" +
                "d.entiteAdministrative.libelle, FUNCTION('MONTH', d.createdOn), COUNT(d)) " +
                "FROM Document d " +
                "WHERE FUNCTION('YEAR', d.createdOn) = :year " +
                "AND d.deleted = false " +
                "GROUP BY d.entiteAdministrative.libelle, FUNCTION('MONTH', d.createdOn)";

        TypedQuery<MonthlyDocumentCountDTO> query = entityManager.createQuery(jpqlQuery, MonthlyDocumentCountDTO.class);
        query.setParameter("year", year);
        return query.getResultList();
    }
    public List<MonthlyDocumentCountDTO> countDocumentsByEntiteAdministrative(int year, String entite) {
        List<MonthlyDocumentCountDTO> monthlyStats = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            MonthlyDocumentCountDTO monthlyStat = new MonthlyDocumentCountDTO(entite, i, 0);
            monthlyStats.add(monthlyStat);
        }
        String jpqlQuery = "SELECT new ma.sir.ged.ws.dto.dashboard.MonthlyDocumentCountDTO(" +
                "d.entiteAdministrative.code, FUNCTION('MONTH', d.createdOn), COUNT(d)) " +
                "FROM Document d " +
                "WHERE FUNCTION('YEAR', d.createdOn) = :year " +
                "AND d.entiteAdministrative.code = :codeEntite " +
                "AND d.deleted = false " +
                "GROUP BY d.entiteAdministrative.code, FUNCTION('MONTH', d.createdOn)";

        TypedQuery<MonthlyDocumentCountDTO> query = entityManager.createQuery(jpqlQuery, MonthlyDocumentCountDTO.class);
        query.setParameter("year", year);
        query.setParameter("codeEntite", entite);
        for (MonthlyDocumentCountDTO stat : query.getResultList()) {
            int month = stat.getMonth();
            monthlyStats.set(month - 1, stat);
        }

        return monthlyStats;

    }
}
