package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.DocumentPartageUtilisateurDao;
import ma.sir.ged.dao.facade.history.DocumentPartageUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentPartageUtilisateurSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentPartageUtilisateurCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.collaborateur.UtilisateurCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.AccessShareCollaborateurService ;

@Service
public class DocumentPartageUtilisateurCollaborateurServiceImpl extends AbstractServiceImpl<DocumentPartageUtilisateur,DocumentPartageUtilisateurHistory, DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateurHistoryCriteria, DocumentPartageUtilisateurDao,
DocumentPartageUtilisateurHistoryDao> implements DocumentPartageUtilisateurCollaborateurService {




    public List<DocumentPartageUtilisateur> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
    public int deleteByDocumentId(Long id){
        return dao.deleteByDocumentId(id);
    }
    public List<DocumentPartageUtilisateur> findByUtilisateurId(Long id){
        return dao.findByUtilisateurId(id);
    }
    public int deleteByUtilisateurId(Long id){
        return dao.deleteByUtilisateurId(id);
    }
    public List<DocumentPartageUtilisateur> findByAccessShareId(Long id){
        return dao.findByAccessShareId(id);
    }
    public int deleteByAccessShareId(Long id){
        return dao.deleteByAccessShareId(id);
    }





    public void configure() {
        super.configure(DocumentPartageUtilisateur.class,DocumentPartageUtilisateurHistory.class, DocumentPartageUtilisateurHistoryCriteria.class, DocumentPartageUtilisateurSpecification.class);
    }


    @Autowired
    private UtilisateurCollaborateurService utilisateurService ;
    @Autowired
    private DocumentCollaborateurService documentService ;
    @Autowired
    private AccessShareCollaborateurService accessShareService ;

    public DocumentPartageUtilisateurCollaborateurServiceImpl(DocumentPartageUtilisateurDao dao, DocumentPartageUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
