package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.dao.criteria.core.PlanClassementModelIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelIndexHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;

public interface PlanClassementModelIndexService extends IService<PlanClassementModelIndex, PlanClassementModelIndexCriteria, PlanClassementModelIndexHistoryCriteria>{

    PlanClassementModelIndex findByLibelle (String libelle);

    List<PlanClassementModelIndex> findByIndexElementId(Long id);
    List<PlanClassementIndex> findByPlanClassementModelId(long id);

    int deleteByIndexElementId(Long id);

    List<PlanClassementModelIndex> findByDocumentModelId(Long id);

    int deleteByModelId(Long id);

}

/*

public interface PlanClassementModelIndexService {
    PlanClassementModelIndex create (PlanClassementModelIndex planClassementModelIndex);
    PlanClassementModelIndex update (PlanClassementModelIndex planClassementModelIndex);
    PlanClassementModelIndex findById (Long id);
    PlanClassementModelIndex findByLibelle (String libelle);
    List<PlanClassementModelIndex> getAll();

    List<PlanClassementModelIndex> findByIndexElementId(Long id);

    int deleteByIndexElementId(Long id);

    List<PlanClassementModelIndex> findByDocumentModelId(Long id);

    int deleteByModelId(Long id);

}
 */
