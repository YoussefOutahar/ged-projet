package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanClassementIndexElementDao extends AbstractRepository<PlanClassementIndexElement, Long> {
    List<PlanClassementIndexElement> findPlanClassementIndexElementByPlanClassementId(long id);
}
