package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentTagHistoryCriteria;
import ma.sir.ged.bean.history.DocumentTagHistory;


public class DocumentTagHistorySpecification extends AbstractHistorySpecification<DocumentTagHistoryCriteria, DocumentTagHistory> {

    public DocumentTagHistorySpecification(DocumentTagHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentTagHistorySpecification(DocumentTagHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
