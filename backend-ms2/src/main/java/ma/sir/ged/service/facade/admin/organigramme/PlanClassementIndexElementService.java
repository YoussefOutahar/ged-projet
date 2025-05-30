package ma.sir.ged.service.facade.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexElementCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexElementHistoryCriteria;
import ma.sir.ged.zynerator.service.IService;

import java.util.List;

public interface PlanClassementIndexElementService extends IService<PlanClassementIndexElement, PlanClassementIndexElementCriteria, PlanClassementIndexElementHistoryCriteria> {

    List<PlanClassementIndexElement> findByIndexElementId(Long id);
    int deleteByIndexElementId(Long id);
    List<PlanClassementIndexElement> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);

    List<PlanClassement> searchPlanClassementByIndexElement(String value);
    List<PlanClassementIndexElement> getPlanIndexElemenetByplanClassement(long id);

}

/*

public interface PlanClassementIndexElementService {
    PlanClassementIndexElement create (PlanClassementIndexElement planClassementIndexElement);
    PlanClassementIndexElement update (PlanClassementIndexElement planClassementIndexElement);
    PlanClassementIndexElement delete (Long id);
    PlanClassementIndexElement findById (Long id);
    List<PlanClassementIndexElement> getAll();
    List<PlanClassementIndexElement> findByIndexElementId(Long id);
    int deleteByIndexElementId(Long id);
    List<PlanClassementIndexElement> findByDocumentId(Long id);
    int deleteByDocumentId(Long id);

}
 */
