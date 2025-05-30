package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentielpartage.AccessShare;
import ma.sir.ged.bean.history.AccessShareHistory;
import ma.sir.ged.dao.criteria.core.AccessShareCriteria;
import ma.sir.ged.dao.criteria.history.AccessShareHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentielpartage.AccessShareDao;
import ma.sir.ged.dao.facade.history.AccessShareHistoryDao;
import ma.sir.ged.dao.specification.core.AccessShareSpecification;
import ma.sir.ged.service.facade.collaborateur.AccessShareCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class AccessShareCollaborateurServiceImpl extends AbstractServiceImpl<AccessShare,AccessShareHistory, AccessShareCriteria, AccessShareHistoryCriteria, AccessShareDao,
AccessShareHistoryDao> implements AccessShareCollaborateurService {



    public AccessShare findByReferenceEntity(AccessShare t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(AccessShare.class,AccessShareHistory.class, AccessShareHistoryCriteria.class, AccessShareSpecification.class);
    }



    public AccessShareCollaborateurServiceImpl(AccessShareDao dao, AccessShareHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
