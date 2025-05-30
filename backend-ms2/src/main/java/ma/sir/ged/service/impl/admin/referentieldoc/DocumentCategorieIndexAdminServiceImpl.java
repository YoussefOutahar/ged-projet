package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndex;
import ma.sir.ged.bean.history.DocumentCategorieIndexHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieIndexCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieIndexDao;
import ma.sir.ged.dao.facade.history.DocumentCategorieIndexHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentCategorieIndexSpecification;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.admin.referentieldoc.IndexElementAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexRuleAdminService;

@Service
public class DocumentCategorieIndexAdminServiceImpl extends AbstractServiceImpl<DocumentCategorieIndex,DocumentCategorieIndexHistory, DocumentCategorieIndexCriteria, DocumentCategorieIndexHistoryCriteria, DocumentCategorieIndexDao,
DocumentCategorieIndexHistoryDao> implements DocumentCategorieIndexAdminService {




    public List<DocumentCategorieIndex> findByIndexElementId(Long id){
        return dao.findByIndexElementId(id);
    }
    public int deleteByIndexElementId(Long id){
        return dao.deleteByIndexElementId(id);
    }
    public List<DocumentCategorieIndex> findByDocumentCategorieId(Long id){
        return dao.findByDocumentCategorieId(id);
    }
    public int deleteByDocumentCategorieId(Long id){
        return dao.deleteByDocumentCategorieId(id);
    }
    public List<DocumentCategorieIndex> findByDocumentCategorieIndexRuleId(Long id){
        return dao.findByDocumentCategorieIndexRuleId(id);
    }
    public int deleteByDocumentCategorieIndexRuleId(Long id){
        return dao.deleteByDocumentCategorieIndexRuleId(id);
    }

    @Override
    public long countByIndexElementId(Long id) {
        return dao.countByIndexElementId(id);
    }

    @Override
    public long countByDocumentCategorieIndexRuleId(Long id) {
        return dao.countByDocumentCategorieIndexRuleId(id);
    }


    public void configure() {
        super.configure(DocumentCategorieIndex.class,DocumentCategorieIndexHistory.class, DocumentCategorieIndexHistoryCriteria.class, DocumentCategorieIndexSpecification.class);
    }


    @Autowired
    private IndexElementAdminService indexElementService ;
    @Autowired
    private DocumentCategorieAdminService documentCategorieService ;
    @Autowired
    private DocumentCategorieIndexRuleAdminService documentCategorieIndexRuleService ;

    public DocumentCategorieIndexAdminServiceImpl(DocumentCategorieIndexDao dao, DocumentCategorieIndexHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
