package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentieldoc.DocumentState;
import ma.sir.ged.bean.history.DocumentStateHistory;
import ma.sir.ged.dao.criteria.core.DocumentStateCriteria;
import ma.sir.ged.dao.criteria.history.DocumentStateHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentStateDao;
import ma.sir.ged.dao.facade.history.DocumentStateHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentStateSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentStateCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class DocumentStateCollaborateurServiceImpl extends AbstractServiceImpl<DocumentState,DocumentStateHistory, DocumentStateCriteria, DocumentStateHistoryCriteria, DocumentStateDao,
DocumentStateHistoryDao> implements DocumentStateCollaborateurService {



    public DocumentState findByReferenceEntity(DocumentState t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(DocumentState.class,DocumentStateHistory.class, DocumentStateHistoryCriteria.class, DocumentStateSpecification.class);
    }



    public DocumentStateCollaborateurServiceImpl(DocumentStateDao dao, DocumentStateHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
