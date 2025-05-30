package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.Tag;
import ma.sir.ged.bean.history.TagHistory;
import ma.sir.ged.dao.criteria.core.TagCriteria;
import ma.sir.ged.dao.criteria.history.TagHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.TagDao;
import ma.sir.ged.dao.facade.history.TagHistoryDao;
import ma.sir.ged.dao.specification.core.TagSpecification;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentTagAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.TagAdminService;
import ma.sir.ged.service.facade.admin.referentielpartage.GroupeUtilisateurAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TagAdminServiceImpl extends AbstractServiceImpl<Tag,TagHistory, TagCriteria, TagHistoryCriteria, TagDao,
TagHistoryDao> implements TagAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentTagService.countByTagId(id) == 0;
    }

    public Tag findByReferenceEntity(Tag t) {
        Tag byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            Tag byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }




    public void configure() {
        super.configure(Tag.class,TagHistory.class, TagHistoryCriteria.class, TagSpecification.class);
    }



    public TagAdminServiceImpl(TagDao dao, TagHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentTagAdminService documentTagService;

}
