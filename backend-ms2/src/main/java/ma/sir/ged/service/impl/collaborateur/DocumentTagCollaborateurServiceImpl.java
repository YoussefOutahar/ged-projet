package ma.sir.ged.service.impl.collaborateur;


import ma.sir.ged.bean.core.referentieldoc.DocumentTag;
import ma.sir.ged.bean.history.DocumentTagHistory;
import ma.sir.ged.dao.criteria.core.DocumentTagCriteria;
import ma.sir.ged.dao.criteria.history.DocumentTagHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentTagDao;
import ma.sir.ged.dao.facade.history.DocumentTagHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentTagSpecification;
import ma.sir.ged.service.facade.collaborateur.DocumentTagCollaborateurService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.stereotype.Service;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;


import ma.sir.ged.service.facade.collaborateur.TagCollaborateurService ;
import ma.sir.ged.service.facade.collaborateur.DocumentCollaborateurService ;

@Service
public class DocumentTagCollaborateurServiceImpl extends AbstractServiceImpl<DocumentTag,DocumentTagHistory, DocumentTagCriteria, DocumentTagHistoryCriteria, DocumentTagDao,
DocumentTagHistoryDao> implements DocumentTagCollaborateurService {




    public List<DocumentTag> findByDocumentId(Long id){
        return dao.findByDocumentId(id);
    }
    public int deleteByDocumentId(Long id){
        return dao.deleteByDocumentId(id);
    }
    public List<DocumentTag> findByTagId(Long id){
        return dao.findByTagId(id);
    }
    public int deleteByTagId(Long id){
        return dao.deleteByTagId(id);
    }





    public void configure() {
        super.configure(DocumentTag.class,DocumentTagHistory.class, DocumentTagHistoryCriteria.class, DocumentTagSpecification.class);
    }


    @Autowired
    private TagCollaborateurService tagService ;
    @Autowired
    private DocumentCollaborateurService documentService ;

    public DocumentTagCollaborateurServiceImpl(DocumentTagDao dao, DocumentTagHistoryDao historyDao) {
        super(dao, historyDao);
    }

}
