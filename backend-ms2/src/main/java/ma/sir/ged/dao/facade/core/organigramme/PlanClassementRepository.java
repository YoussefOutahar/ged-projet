package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.EntiteAdministrative;
import ma.sir.ged.bean.core.organigramme.PlanClassement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanClassementRepository extends JpaRepository<PlanClassement, Long> {
    PlanClassement findByLibelle(String libelle);
    PlanClassement findByLibelleAndParentId(String libelle, Long parentId);
    PlanClassement findByCode(String code);
    List<PlanClassement> findByLibelleContaining(String libelle);

    @Query("SELECT p FROM PlanClassement p WHERE p.parent.id = null")
    List<PlanClassement> findParentPlanClassement();

    @Query("SELECT p FROM PlanClassement p WHERE p.parent.id = :parentId")
    List<PlanClassement> findChildrenByParentId(Long parentId);

    List<PlanClassement> findPlanClassementByArchiveTrue();
    List<PlanClassement> findPlanClassementByArchiveFalse();

    PlanClassement findPlanClassementById(Long parentId);

    @Query("SELECT count(p) FROM PlanClassement p WHERE p.planClassementModel.id = :id")
    int countModelUsage(Long id);

    @Query("SELECT count(p) FROM PlanClassement p WHERE p.archive = false ")
    int getCountAllPlans();

}
