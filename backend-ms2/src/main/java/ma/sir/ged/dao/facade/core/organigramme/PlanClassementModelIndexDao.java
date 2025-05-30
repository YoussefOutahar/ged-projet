package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanClassementModelIndexDao extends AbstractRepository<PlanClassementModelIndex, Long> {
    @Query("SELECT p.planClassementIndex FROM PlanClassementModelIndex p WHERE p.planClassementModel.id = :modelId")
    List<PlanClassementIndex> findPlanClassementIndexsByModelId(@Param("modelId") Long modelId);

    int countByPlanClassementIndexId(Long id);

    @Query("SELECT distinct p.planClassementIndex FROM PlanClassementModelIndex p WHERE p.planClassementModel.id = :id")
    List<PlanClassementIndex> findIndexsByPlanClassementModelId (Long id);

    List<PlanClassementModelIndex> findAllByPlanClassementModelId(long id);

    void deleteById(long id);
}
