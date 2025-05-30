package ma.sir.ged.service.impl.admin.referentielpartage;


import ma.sir.ged.bean.core.referentielpartage.AccessShare;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;
import ma.sir.ged.bean.history.AccessShareHistory;
import ma.sir.ged.dao.criteria.core.AccessShareCriteria;
import ma.sir.ged.dao.criteria.history.AccessShareHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.AccessShareDao;
import ma.sir.ged.dao.facade.history.AccessShareHistoryDao;
import ma.sir.ged.dao.specification.core.AccessShareSpecification;
import ma.sir.ged.service.facade.admin.referentielpartage.AccessShareAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageGroupeAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.DocumentPartageUtilisateurAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccessShareAdminServiceImpl extends AbstractServiceImpl<AccessShare,AccessShareHistory, AccessShareCriteria, AccessShareHistoryCriteria, AccessShareDao,
AccessShareHistoryDao> implements AccessShareAdminService {



    public AccessShare findByReferenceEntity(AccessShare t){
        AccessShare byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            AccessShare byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }

    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentPartageUtilisateurService.countByAccessShareId(id) == 0 && documentPartageGroupeService.countByAccessShareId(id) == 0 ;
    }

    public void configure() {
        super.configure(AccessShare.class,AccessShareHistory.class, AccessShareHistoryCriteria.class, AccessShareSpecification.class);
    }



    public AccessShareAdminServiceImpl(AccessShareDao dao, AccessShareHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentPartageGroupeAdminService documentPartageGroupeService ;
    @Autowired
    private DocumentPartageUtilisateurAdminService documentPartageUtilisateurService ;
}
