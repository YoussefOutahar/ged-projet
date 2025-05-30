package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.DocumentPartageUtilisateurDao;
import ma.sir.ged.dao.facade.history.DocumentPartageUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentPartageUtilisateurSpecification;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageUtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.doc.DocumentAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.AccessShareAdminService;

import javax.transaction.Transactional;

@Service
public class DocumentPartageUtilisateurAdminServiceImpl extends AbstractServiceImpl<DocumentPartageUtilisateur,DocumentPartageUtilisateurHistory, DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateurHistoryCriteria, DocumentPartageUtilisateurDao,
DocumentPartageUtilisateurHistoryDao> implements DocumentPartageUtilisateurAdminService {




    public List<DocumentPartageUtilisateur> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
    @Transactional
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

    @Override
    public long countByAccessShareId(Long id) {
        return dao.countByAccessShareId(id);
    }

    @Override
    public long countByUtilisateurId(Long id) {
        return dao.countByUtilisateurId(id);
    }


    public void configure() {
        super.configure(DocumentPartageUtilisateur.class,DocumentPartageUtilisateurHistory.class, DocumentPartageUtilisateurHistoryCriteria.class, DocumentPartageUtilisateurSpecification.class);
    }


    @Autowired
    private UtilisateurAdminService utilisateurService ;
    @Autowired
    private DocumentAdminService documentService ;
    @Autowired
    private AccessShareAdminService accessShareService ;

    public DocumentPartageUtilisateurAdminServiceImpl(DocumentPartageUtilisateurDao dao, DocumentPartageUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
