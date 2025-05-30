package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.IndexElement;
import ma.sir.ged.bean.history.IndexElementHistory;
import ma.sir.ged.dao.criteria.core.IndexElementCriteria;
import ma.sir.ged.dao.criteria.history.IndexElementHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.IndexElementDao;
import ma.sir.ged.dao.facade.history.IndexElementHistoryDao;
import ma.sir.ged.dao.specification.core.IndexElementSpecification;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentIndexElementAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.IndexElementAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class IndexElementAdminServiceImpl extends AbstractServiceImpl<IndexElement, IndexElementHistory, IndexElementCriteria, IndexElementHistoryCriteria, IndexElementDao,
        IndexElementHistoryDao> implements IndexElementAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentIndexElementService.countByIndexElementId(id) == 0 && documentCategorieIndexService.countByIndexElementId(id) == 0;
    }

    public IndexElement findByReferenceEntity(IndexElement t) {
        IndexElement byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            IndexElement byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }

    public void configure() {
        super.configure(IndexElement.class, IndexElementHistory.class, IndexElementHistoryCriteria.class, IndexElementSpecification.class);
    }


    public IndexElementAdminServiceImpl(IndexElementDao dao, IndexElementHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentCategorieIndexAdminService documentCategorieIndexService;
    @Autowired
    private DocumentIndexElementAdminService documentIndexElementService;

}
