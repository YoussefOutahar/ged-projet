package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentIndexElement;
import ma.sir.ged.bean.history.DocumentIndexElementHistory;
import ma.sir.ged.dao.criteria.core.DocumentIndexElementCriteria;
import ma.sir.ged.dao.criteria.history.DocumentIndexElementHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentIndexElementDao;
import ma.sir.ged.dao.facade.history.DocumentIndexElementHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentIndexElementSpecification;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentIndexElementAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.admin.referentieldoc.IndexElementAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;

import javax.transaction.Transactional;

@Service
public class DocumentIndexElementAdminServiceImpl extends AbstractServiceImpl<DocumentIndexElement,DocumentIndexElementHistory, DocumentIndexElementCriteria, DocumentIndexElementHistoryCriteria, DocumentIndexElementDao,
DocumentIndexElementHistoryDao> implements DocumentIndexElementAdminService {




    public List<DocumentIndexElement> findByIndexElementId(Long id){
        return dao.findByIndexElementId(id);
    }
    public int deleteByIndexElementId(Long id){
        return dao.deleteByIndexElementId(id);
    }
    public List<DocumentIndexElement> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
    @Transactional
    public int deleteByDocumentId(Long id){
        return dao.deleteByDocumentId(id);
    }

    @Override
    public long countByIndexElementId(Long id) {
        return dao.countByIndexElementId(id);
    }


    public void configure() {
        super.configure(DocumentIndexElement.class,DocumentIndexElementHistory.class, DocumentIndexElementHistoryCriteria.class, DocumentIndexElementSpecification.class);
    }


    @Autowired
    private IndexElementAdminService indexElementService ;
    @Autowired
    private DocumentAdminService documentService ;

    public DocumentIndexElementAdminServiceImpl(DocumentIndexElementDao dao, DocumentIndexElementHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
