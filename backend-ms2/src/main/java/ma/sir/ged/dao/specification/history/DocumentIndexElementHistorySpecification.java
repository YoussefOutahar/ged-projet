package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentIndexElementHistoryCriteria;
import ma.sir.ged.bean.history.DocumentIndexElementHistory;


public class DocumentIndexElementHistorySpecification extends AbstractHistorySpecification<DocumentIndexElementHistoryCriteria, DocumentIndexElementHistory> {

    public DocumentIndexElementHistorySpecification(DocumentIndexElementHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentIndexElementHistorySpecification(DocumentIndexElementHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
