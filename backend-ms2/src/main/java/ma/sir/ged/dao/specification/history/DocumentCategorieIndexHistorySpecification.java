package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentCategorieIndexHistoryCriteria;
import ma.sir.ged.bean.history.DocumentCategorieIndexHistory;


public class DocumentCategorieIndexHistorySpecification extends AbstractHistorySpecification<DocumentCategorieIndexHistoryCriteria, DocumentCategorieIndexHistory> {

    public DocumentCategorieIndexHistorySpecification(DocumentCategorieIndexHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentCategorieIndexHistorySpecification(DocumentCategorieIndexHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
