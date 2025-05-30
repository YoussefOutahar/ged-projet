package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexRuleHistoryCriteria;
import ma.sir.ged.bean.history.DocumentCategorieIndexRuleHistory;


public class DocumentCategorieIndexRuleHistorySpecification extends AbstractHistorySpecification<DocumentCategorieIndexRuleHistoryCriteria, DocumentCategorieIndexRuleHistory> {

    public DocumentCategorieIndexRuleHistorySpecification(DocumentCategorieIndexRuleHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentCategorieIndexRuleHistorySpecification(DocumentCategorieIndexRuleHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
