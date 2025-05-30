package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.RoleUtilisateur;
import ma.sir.ged.bean.history.RoleUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.RoleUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.RoleUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.RoleUtilisateurDao;
import ma.sir.ged.dao.facade.history.RoleUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.RoleUtilisateurSpecification;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.RoleUtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoleUtilisateurAdminServiceImpl extends AbstractServiceImpl<RoleUtilisateur, RoleUtilisateurHistory, RoleUtilisateurCriteria, RoleUtilisateurHistoryCriteria, RoleUtilisateurDao,
        RoleUtilisateurHistoryDao> implements RoleUtilisateurAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return groupeUtilisateurService.countByEtatUtilisateurId(id) == 0;
    }

    public RoleUtilisateur findByReferenceEntity(RoleUtilisateur t) {
        RoleUtilisateur byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            RoleUtilisateur byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(RoleUtilisateur.class, RoleUtilisateurHistory.class, RoleUtilisateurHistoryCriteria.class, RoleUtilisateurSpecification.class);
    }


    public RoleUtilisateurAdminServiceImpl(RoleUtilisateurDao dao, RoleUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private GroupeUtilisateurAdminService groupeUtilisateurService;
}
