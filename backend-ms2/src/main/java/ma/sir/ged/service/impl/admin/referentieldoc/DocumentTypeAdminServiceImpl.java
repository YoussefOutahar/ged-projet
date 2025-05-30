package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentType;
import ma.sir.ged.bean.history.DocumentTypeHistory;
import ma.sir.ged.dao.criteria.core.DocumentTypeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTypeHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentTypeDao;
import ma.sir.ged.dao.facade.history.DocumentTypeHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentTypeSpecification;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentTypeAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentTypeAdminServiceImpl extends AbstractServiceImpl<DocumentType, DocumentTypeHistory, DocumentTypeCriteria, DocumentTypeHistoryCriteria, DocumentTypeDao,
        DocumentTypeHistoryDao> implements DocumentTypeAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentService.countByDocumentTypeId(id) == 0;
    }

    public DocumentType findByReferenceEntity(DocumentType t) {
        DocumentType byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            DocumentType byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(DocumentType.class, DocumentTypeHistory.class, DocumentTypeHistoryCriteria.class, DocumentTypeSpecification.class);
    }


    public DocumentTypeAdminServiceImpl(DocumentTypeDao dao, DocumentTypeHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentAdminService documentService;

}
