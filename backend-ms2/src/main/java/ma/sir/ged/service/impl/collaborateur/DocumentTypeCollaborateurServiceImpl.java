package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentieldoc.DocumentType;
import ma.sir.ged.bean.history.DocumentTypeHistory;
import ma.sir.ged.dao.criteria.core.DocumentTypeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTypeHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentTypeDao;
import ma.sir.ged.dao.facade.history.DocumentTypeHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentTypeSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentTypeCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class DocumentTypeCollaborateurServiceImpl extends AbstractServiceImpl<DocumentType,DocumentTypeHistory, DocumentTypeCriteria, DocumentTypeHistoryCriteria, DocumentTypeDao,
DocumentTypeHistoryDao> implements DocumentTypeCollaborateurService {



    public DocumentType findByReferenceEntity(DocumentType t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(DocumentType.class,DocumentTypeHistory.class, DocumentTypeHistoryCriteria.class, DocumentTypeSpecification.class);
    }



    public DocumentTypeCollaborateurServiceImpl(DocumentTypeDao dao, DocumentTypeHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
