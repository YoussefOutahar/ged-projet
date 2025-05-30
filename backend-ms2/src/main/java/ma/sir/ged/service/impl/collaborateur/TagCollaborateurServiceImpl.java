package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentieldoc.Tag;
import ma.sir.ged.bean.history.TagHistory;
import ma.sir.ged.dao.criteria.core.TagCriteria;
import ma.sir.ged.dao.criteria.history.TagHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.TagDao;
import ma.sir.ged.dao.facade.history.TagHistoryDao;
import ma.sir.ged.dao.specification.core.TagSpecification;
import ma.sir.ged.service.facade.collaborateur.TagCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class TagCollaborateurServiceImpl extends AbstractServiceImpl<Tag,TagHistory, TagCriteria, TagHistoryCriteria, TagDao,
TagHistoryDao> implements TagCollaborateurService {



    public Tag findByReferenceEntity(Tag t){
        return  dao.findByCode(t.getCode());
    }






    public void configure() {
        super.configure(Tag.class,TagHistory.class, TagHistoryCriteria.class, TagSpecification.class);
    }



    public TagCollaborateurServiceImpl(TagDao dao, TagHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
