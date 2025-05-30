package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageGroupeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageGroupeHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.DocumentPartageGroupeDao;
import ma.sir.ged.dao.facade.history.DocumentPartageGroupeHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentPartageGroupeSpecification;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageGroupeAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.admin.referentielpartage.GroupeAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.AccessShareAdminService;

import javax.transaction.Transactional;

@Service
public class DocumentPartageGroupeAdminServiceImpl extends AbstractServiceImpl<DocumentPartageGroupe,DocumentPartageGroupeHistory, DocumentPartageGroupeCriteria, DocumentPartageGroupeHistoryCriteria, DocumentPartageGroupeDao,
DocumentPartageGroupeHistoryDao> implements DocumentPartageGroupeAdminService {




    public List<DocumentPartageGroupe> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
    @Transactional
    public int deleteByDocumentId(Long id){
        return dao.deleteByDocumentId(id);
    }
    public List<DocumentPartageGroupe> findByGroupeId(Long id){
        return dao.findByGroupeId(id);
    }
    public int deleteByGroupeId(Long id){
        return dao.deleteByGroupeId(id);
    }
    public List<DocumentPartageGroupe> findByAccessShareId(Long id){
        return dao.findByAccessShareId(id);
    }
    public int deleteByAccessShareId(Long id){
        return dao.deleteByAccessShareId(id);
    }

    @Override
    public long countByAccessShareId(Long id) {
        return dao.countByAccessShareId(id);
    }

    @Override
    public long countByGroupeId(Long id) {
        return dao.countByGroupeId(id);
    }


    public void configure() {
        super.configure(DocumentPartageGroupe.class,DocumentPartageGroupeHistory.class, DocumentPartageGroupeHistoryCriteria.class, DocumentPartageGroupeSpecification.class);
    }


    @Autowired
    private GroupeAdminService groupeService ;
    @Autowired
    private DocumentAdminService documentService ;
    @Autowired
    private AccessShareAdminService accessShareService ;

    public DocumentPartageGroupeAdminServiceImpl(DocumentPartageGroupeDao dao, DocumentPartageGroupeHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
