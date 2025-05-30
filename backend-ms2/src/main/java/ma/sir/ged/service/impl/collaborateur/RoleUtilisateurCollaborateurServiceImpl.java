package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import ma.sir.ged.bean.history.RoleUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.RoleUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.RoleUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.RoleUtilisateurDao;
import ma.sir.ged.dao.facade.history.RoleUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.RoleUtilisateurSpecification;
import ma.sir.ged.service.facade.collaborateur.RoleUtilisateurCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class RoleUtilisateurCollaborateurServiceImpl extends AbstractServiceImpl<RoleUtilisateur,RoleUtilisateurHistory, RoleUtilisateurCriteria, RoleUtilisateurHistoryCriteria, RoleUtilisateurDao,
RoleUtilisateurHistoryDao> implements RoleUtilisateurCollaborateurService {



    public RoleUtilisateur findByReferenceEntity(RoleUtilisateur t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(RoleUtilisateur.class,RoleUtilisateurHistory.class, RoleUtilisateurHistoryCriteria.class, RoleUtilisateurSpecification.class);
    }



    public RoleUtilisateurCollaborateurServiceImpl(RoleUtilisateurDao dao, RoleUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
