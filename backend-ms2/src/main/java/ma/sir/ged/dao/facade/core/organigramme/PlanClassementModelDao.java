package ma.sir.ged.dao.facade.core.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementModel;
import ma.sir.ged.zynerator.repository.AbstractRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlanClassementModelDao extends AbstractRepository<PlanClassementModel, Long> {
}
