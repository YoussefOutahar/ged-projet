package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.bean.history.DocumentStateHistory;
import ma.sir.ged.dao.criteria.core.DocumentStateCriteria;
import ma.sir.ged.dao.criteria.history.DocumentStateHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentStateDao;
import ma.sir.ged.dao.facade.history.DocumentStateHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentStateSpecification;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentStateAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentStateAdminServiceImpl extends AbstractServiceImpl<DocumentState, DocumentStateHistory, DocumentStateCriteria, DocumentStateHistoryCriteria, DocumentStateDao,
        DocumentStateHistoryDao> implements DocumentStateAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentService.countByDocumentStateId(id) == 0;
    }

    public DocumentState findByReferenceEntity(DocumentState t) {
        DocumentState byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            DocumentState byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(DocumentState.class, DocumentStateHistory.class, DocumentStateHistoryCriteria.class, DocumentStateSpecification.class);
    }


    public DocumentStateAdminServiceImpl(DocumentStateDao dao, DocumentStateHistoryDao historyDao) {
        super(dao, historyDao);
    }



    @Autowired
    private DocumentAdminService documentService;


    @Override
    public DocumentState findByLibelle(String libelle) {
        return dao.findByLibelle(libelle);
    }
}
