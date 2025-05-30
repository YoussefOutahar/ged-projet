package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentCategorieHistoryCriteria;
import ma.sir.ged.bean.history.DocumentCategorieHistory;


public class DocumentCategorieHistorySpecification extends AbstractHistorySpecification<DocumentCategorieHistoryCriteria, DocumentCategorieHistory> {

    public DocumentCategorieHistorySpecification(DocumentCategorieHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentCategorieHistorySpecification(DocumentCategorieHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
