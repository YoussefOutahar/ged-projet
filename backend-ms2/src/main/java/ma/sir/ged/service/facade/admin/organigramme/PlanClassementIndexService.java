package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

public interface PlanClassementIndexService extends IService<PlanClassementIndex, PlanClassementIndexCriteria, PlanClassementIndexHistoryCriteria> {

    PlanClassementIndex findByLibelle (String libelle);

    boolean deleteIndex(Long id);
}

