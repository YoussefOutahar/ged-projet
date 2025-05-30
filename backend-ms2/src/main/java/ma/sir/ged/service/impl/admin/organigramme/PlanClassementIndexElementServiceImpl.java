package ma.sir.ged.service.impl.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassement;
import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.bean.history.PlanClassementIndexElementHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexElementCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexElementHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementIndexElementDao;
import ma.sir.ged.dao.facade.history.PlanClassementIndexElementHistoryDao;
import ma.sir.ged.dao.specification.core.PlanClassementIndexElementSpecification;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementIndexElementService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
@Service
public class PlanClassementIndexElementServiceImpl extends AbstractServiceImpl<PlanClassementIndexElement, PlanClassementIndexElementHistory, PlanClassementIndexElementCriteria, PlanClassementIndexElementHistoryCriteria, PlanClassementIndexElementDao,
        PlanClassementIndexElementHistoryDao> implements PlanClassementIndexElementService {
    public PlanClassementIndexElementServiceImpl(PlanClassementIndexElementDao dao, PlanClassementIndexElementHistoryDao historyRepository) {
        super(dao, historyRepository);
    }

    @Override
    public List<PlanClassementIndexElement> findByIndexElementId(Long id) {
        return null;
    }

    @Override
    public int deleteByIndexElementId(Long id) {
        return 0;
    }

    @Override
    public List<PlanClassementIndexElement> findByDocumentId(Long id) {
        return null;
    }

    @Override
    public int deleteByDocumentId(Long id) {
        return 0;
    }

    @Override
    public List<PlanClassement> searchPlanClassementByIndexElement(String value) {
        List<PlanClassementIndexElement> planClassementIndexElements = dao.findAll();
        List<PlanClassement> planClassements = new ArrayList<>();

        planClassementIndexElements.forEach(planClassementIndexElement -> {
            if (planClassementIndexElement.getValue().contains(value)) {
                planClassements.add(planClassementIndexElement.getPlanClassement());
            }
        });
        return planClassements;
    }

    @Override
    public List<PlanClassementIndexElement> getPlanIndexElemenetByplanClassement(long id) {
        return dao.findPlanClassementIndexElementByPlanClassementId(id);
    }


    @Override
    public void configure() {
        super.configure(PlanClassementIndexElement.class, PlanClassementIndexElementHistory.class, PlanClassementIndexElementHistoryCriteria.class, PlanClassementIndexElementSpecification.class);
    }

}

/*
    @Service
public class PlanClassementIndexElementServiceImpl implements PlanClassementIndexElementService {
    @Autowired
    private PlanClassementIndexElementDao dao ;
    @Override
    public PlanClassementIndexElement create(PlanClassementIndexElement planClassementIndexElement) {
        return null;
    }

    @Override
    public PlanClassementIndexElement update(PlanClassementIndexElement planClassementIndexElement) {
        return null;
    }

    @Override
    public PlanClassementIndexElement delete(Long id) {
        return null;
    }

    @Override
    public PlanClassementIndexElement findById(Long id) {
        return null;
    }

    @Override
    public List<PlanClassementIndexElement> getAll() {
        return null;
    }

    @Override
    public List<PlanClassementIndexElement> findByIndexElementId(Long id) {
        return null;
    }

    @Override
    public int deleteByIndexElementId(Long id) {
        return 0;
    }

    @Override
    public List<PlanClassementIndexElement> findByDocumentId(Long id) {
        return null;
    }

    @Override
    public int deleteByDocumentId(Long id) {
        return 0;
    }
}

 */
