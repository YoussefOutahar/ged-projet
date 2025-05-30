package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.organigramme.Gender;
import ma.sir.ged.bean.history.GenderHistory;
import ma.sir.ged.dao.criteria.core.GenderCriteria;
import ma.sir.ged.dao.criteria.history.GenderHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.GenderDao;
import ma.sir.ged.dao.facade.history.GenderHistoryDao;
import ma.sir.ged.dao.specification.core.GenderSpecification;
import ma.sir.ged.service.facade.collaborateur.GenderCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class GenderCollaborateurServiceImpl extends AbstractServiceImpl<Gender,GenderHistory, GenderCriteria, GenderHistoryCriteria, GenderDao,
GenderHistoryDao> implements GenderCollaborateurService {



    public Gender findByReferenceEntity(Gender t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(Gender.class,GenderHistory.class, GenderHistoryCriteria.class, GenderSpecification.class);
    }



    public GenderCollaborateurServiceImpl(GenderDao dao, GenderHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
