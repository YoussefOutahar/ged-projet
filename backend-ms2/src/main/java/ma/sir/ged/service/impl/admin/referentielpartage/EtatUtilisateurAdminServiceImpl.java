package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;
import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;
import ma.sir.ged.bean.history.EtatUtilisateurHistory;
import ma.sir.ged.dao.criteria.core.EtatUtilisateurCriteria;
import ma.sir.ged.dao.criteria.history.EtatUtilisateurHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.EtatUtilisateurDao;
import ma.sir.ged.dao.facade.history.EtatUtilisateurHistoryDao;
import ma.sir.ged.dao.specification.core.EtatUtilisateurSpecification;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.EtatUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EtatUtilisateurAdminServiceImpl extends AbstractServiceImpl<EtatUtilisateur,EtatUtilisateurHistory, EtatUtilisateurCriteria, EtatUtilisateurHistoryCriteria, EtatUtilisateurDao,
EtatUtilisateurHistoryDao> implements EtatUtilisateurAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return groupeUtilisateurService.countByEtatUtilisateurId(id) == 0;
    }


    public EtatUtilisateur findByReferenceEntity(EtatUtilisateur t) {
        EtatUtilisateur byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            EtatUtilisateur byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }




    public void configure() {
        super.configure(EtatUtilisateur.class,EtatUtilisateurHistory.class, EtatUtilisateurHistoryCriteria.class, EtatUtilisateurSpecification.class);
    }



    public EtatUtilisateurAdminServiceImpl(EtatUtilisateurDao dao, EtatUtilisateurHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private GroupeUtilisateurAdminService groupeUtilisateurService;
}
