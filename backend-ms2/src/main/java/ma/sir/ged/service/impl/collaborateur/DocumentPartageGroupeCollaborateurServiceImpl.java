package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageGroupeCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageGroupeHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.DocumentPartageGroupeDao;
import ma.sir.ged.dao.facade.history.DocumentPartageGroupeHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentPartageGroupeSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentPartageGroupeCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.collaborateur.GroupeCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.AccessShareCollaborateurService ;

@Service
public class DocumentPartageGroupeCollaborateurServiceImpl extends AbstractServiceImpl<DocumentPartageGroupe,DocumentPartageGroupeHistory, DocumentPartageGroupeCriteria, DocumentPartageGroupeHistoryCriteria, DocumentPartageGroupeDao,
DocumentPartageGroupeHistoryDao> implements DocumentPartageGroupeCollaborateurService {




    public List<DocumentPartageGroupe> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
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





    public void configure() {
        super.configure(DocumentPartageGroupe.class,DocumentPartageGroupeHistory.class, DocumentPartageGroupeHistoryCriteria.class, DocumentPartageGroupeSpecification.class);
    }


    @Autowired
    private GroupeCollaborateurService groupeService ;
    @Autowired
    private DocumentCollaborateurService documentService ;
    @Autowired
    private AccessShareCollaborateurService accessShareService ;

    public DocumentPartageGroupeCollaborateurServiceImpl(DocumentPartageGroupeDao dao, DocumentPartageGroupeHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
