package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.EtatUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.EtatUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.EtatUtilisateurDao;
import ma.sir.ged.dao.facade.history.EtatUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.EtatUtilisateurSpecification;
import ma.sir.ged.service.facade.collaborateur.EtatUtilisateurCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class EtatUtilisateurCollaborateurServiceImpl extends AbstractServiceImpl<EtatUtilisateur,EtatUtilisateurHistory, EtatUtilisateurCriteria, EtatUtilisateurHistoryCriteria, EtatUtilisateurDao,
EtatUtilisateurHistoryDao> implements EtatUtilisateurCollaborateurService {



    public EtatUtilisateur findByReferenceEntity(EtatUtilisateur t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(EtatUtilisateur.class,EtatUtilisateurHistory.class, EtatUtilisateurHistoryCriteria.class, EtatUtilisateurSpecification.class);
    }



    public EtatUtilisateurCollaborateurServiceImpl(EtatUtilisateurDao dao, EtatUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
