package ma.sir.ged.service.impl.admin.organigramme;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.bean.history.PlanClassementModelIndexHistory;
import ma.sir.ged.dao.criteria.core.PlanClassementModelIndexCriteria;
import ma.sir.ged.dao.criteria.history.PlanClassementModelIndexHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.PlanClassementModelIndexDao;
import ma.sir.ged.dao.facade.history.PlanClassementModelIndexHistoryDao;
import ma.sir.ged.dao.specification.core.PlanClassementModelIndexSpecification;
import ma.sir.ged.service.facade.admin.organigramme.PlanClassementModelIndexService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlanClassementModelIndexServiceImpl  extends AbstractServiceImpl<PlanClassementModelIndex, PlanClassementModelIndexHistory, PlanClassementModelIndexCriteria, PlanClassementModelIndexHistoryCriteria, PlanClassementModelIndexDao,
        PlanClassementModelIndexHistoryDao> implements PlanClassementModelIndexService {

    public PlanClassementModelIndexServiceImpl(PlanClassementModelIndexDao dao, PlanClassementModelIndexHistoryDao historyRepository) {
        super(dao, historyRepository);
    }

    @Override
    public PlanClassementModelIndex findByLibelle(String libelle) {
        return null;
    }

    @Override
    public List<PlanClassementModelIndex> findByIndexElementId(Long id) {
        return null;
    }

    @Override
    public List<PlanClassementIndex> findByPlanClassementModelId(long id) {
        return dao.findPlanClassementIndexsByModelId(id);
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

    @Override
    public void configure() {
        super.configure(PlanClassementModelIndex.class, PlanClassementModelIndexHistory.class, PlanClassementModelIndexHistoryCriteria.class, PlanClassementModelIndexSpecification.class);
    }


}

/*

@Service
public class PlanClassementModelIndexServiceImpl implements PlanClassementModelIndexService {
    @Autowired
    private PlanClassementModelIndexDao dao;
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
