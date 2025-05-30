package ma.sir.ged.service.impl.admin.organigramme;


import ma.sir.ged.bean.core.organigramme.Gender;
import ma.sir.ged.bean.history.GenderHistory;
import ma.sir.ged.dao.criteria.core.GenderCriteria;
import ma.sir.ged.dao.criteria.history.GenderHistoryCriteria;
import ma.sir.ged.dao.facade.core.organigramme.GenderDao;
import ma.sir.ged.dao.facade.history.GenderHistoryDao;
import ma.sir.ged.dao.specification.core.GenderSpecification;
import ma.sir.ged.service.facade.admin.organigramme.GenderAdminService;
import ma.sir.ged.service.facade.admin.organigramme.UtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GenderAdminServiceImpl extends AbstractServiceImpl<Gender, GenderHistory, GenderCriteria, GenderHistoryCriteria, GenderDao,
        GenderHistoryDao> implements GenderAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return utilisateurService.countByGenderId(id) == 0;
    }

    public Gender findByReferenceEntity(Gender t) {
        Gender byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            Gender byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(Gender.class, GenderHistory.class, GenderHistoryCriteria.class, GenderSpecification.class);
    }


    public GenderAdminServiceImpl(GenderDao dao, GenderHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private UtilisateurAdminService utilisateurService;

}
