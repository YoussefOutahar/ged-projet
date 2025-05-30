package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentHistoryCriteria;
import ma.sir.ged.bean.history.DocumentHistory;


public class DocumentHistorySpecification extends AbstractHistorySpecification<DocumentHistoryCriteria, DocumentHistory> {

    public DocumentHistorySpecification(DocumentHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentHistorySpecification(DocumentHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
