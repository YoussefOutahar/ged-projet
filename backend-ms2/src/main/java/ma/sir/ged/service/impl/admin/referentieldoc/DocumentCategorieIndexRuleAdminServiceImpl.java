package ma.sir.ged.service.impl.admin.referentieldoc;


import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorieIndexRule;
import ma.sir.ged.bean.history.DocumentCategorieIndexRuleHistory;
import ma.sir.ged.dao.criteria.core.DocumentCategorieIndexRuleCriteria;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexRuleHistoryCriteria;
import ma.sir.ged.dao.facade.core.referentieldoc.DocumentCategorieIndexRuleDao;
import ma.sir.ged.dao.facade.history.DocumentCategorieIndexRuleHistoryDao;
import ma.sir.ged.dao.specification.core.DocumentCategorieIndexRuleSpecification;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexAdminService;
import ma.sir.ged.service.facade.admin.referentieldoc.DocumentCategorieIndexRuleAdminService;
import ma.sir.ged.zynerator.service.AbstractServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentCategorieIndexRuleAdminServiceImpl extends AbstractServiceImpl<DocumentCategorieIndexRule, DocumentCategorieIndexRuleHistory, DocumentCategorieIndexRuleCriteria, DocumentCategorieIndexRuleHistoryCriteria, DocumentCategorieIndexRuleDao,
        DocumentCategorieIndexRuleHistoryDao> implements DocumentCategorieIndexRuleAdminService {


    @Override
    public boolean deleteByIdCheckCondition(Long id) {
        return documentCategorieIndexService.countByDocumentCategorieIndexRuleId(id) == 0;
    }

    public DocumentCategorieIndexRule findByReferenceEntity(DocumentCategorie t) {
        DocumentCategorieIndexRule byCode = dao.findByCode(t.getCode());
        if (byCode == null) {
            DocumentCategorieIndexRule byLibelle = dao.findByLibelle(t.getLibelle());
            return byLibelle;
        }
        return byCode;
    }


    public void configure() {
        super.configure(DocumentCategorieIndexRule.class, DocumentCategorieIndexRuleHistory.class, DocumentCategorieIndexRuleHistoryCriteria.class, DocumentCategorieIndexRuleSpecification.class);
    }


    public DocumentCategorieIndexRuleAdminServiceImpl(DocumentCategorieIndexRuleDao dao, DocumentCategorieIndexRuleHistoryDao historyDao) {
        super(dao, historyDao);
    }


    @Autowired
    private DocumentCategorieIndexAdminService documentCategorieIndexService;

}
