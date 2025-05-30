package ma.sir.ged.service.impl.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.history.PlanClassementIndexHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementIndexDao;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementModelIndexDao;
import ma.sir.ged.dao.facade.history.PlanClassementIndexHistoryDao;
import ma.sir.ged.dao.specification.core.PlanClassementIndexSpecification;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementIndexService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class PlanClassementIndexServiceImpl  extends AbstractServiceImpl<PlanClassementIndex, PlanClassementIndexHistory, PlanClassementIndexCriteria, PlanClassementIndexHistoryCriteria, PlanClassementIndexDao,
        PlanClassementIndexHistoryDao> implements PlanClassementIndexService {

    private final PlanClassementModelIndexDao planClassementModelIndexDao;

    public PlanClassementIndexServiceImpl(PlanClassementIndexDao dao, PlanClassementIndexHistoryDao historyRepository,
                                          PlanClassementModelIndexDao planClassementModelIndexDao) {
        super(dao, historyRepository);
        this.planClassementModelIndexDao = planClassementModelIndexDao;
    }

    @Override
    public PlanClassementIndex findByLibelle(String libelle) {
        return null;
    }

    @Override
    public boolean deleteIndex(Long id) {
        int indexUsageCount = planClassementModelIndexDao.countByPlanClassementIndexId(id);
        if (indexUsageCount == 0) {
            dao.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void configure() {
        super.configure(PlanClassementIndex.class, PlanClassementIndexHistory.class, PlanClassementIndexHistoryCriteria.class, PlanClassementIndexSpecification.class);
    }

}

/*

@Service
public class PlanClassementIndexServiceImpl implements PlanClassementModelIndexService {
    @Autowired
    private PlanClassementIndexDao dao;
    @Override
    public PlanClassementModelIndex create(PlanClassementModelIndex planClassementModelIndex) {
        return null;
    }

    @Override
    public PlanClassementModelIndex update(PlanClassementModelIndex planClassementModelIndex) {
        return null;
    }

    @Override
    public PlanClassementModelIndex findById(Long id) {
        return null;
    }

    @Override
    public PlanClassementModelIndex findByLibelle(String libelle) {
        return null;
    }

    @Override
    public List<PlanClassementModelIndex> getAll() {
        return null;
    }

    @Override
    public List<PlanClassementModelIndex> findByIndexElementId(Long id) {
        return null;
    }

    @Override
    public int deleteByIndexElementId(Long id) {
        return 0;
    }

    @Override
    public List<PlanClassementModelIndex> findByDocumentModelId(Long id) {
        return null;
    }

    @Override
    public int deleteByModelId(Long id) {
        return 0;
    }
}
 */
