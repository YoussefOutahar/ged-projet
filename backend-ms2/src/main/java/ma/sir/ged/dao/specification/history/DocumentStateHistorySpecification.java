package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentStateHistoryCriteria;
import ma.sir.ged.bean.history.DocumentStateHistory;


public class DocumentStateHistorySpecification extends AbstractHistorySpecification<DocumentStateHistoryCriteria, DocumentStateHistory> {

    public DocumentStateHistorySpecification(DocumentStateHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentStateHistorySpecification(DocumentStateHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
