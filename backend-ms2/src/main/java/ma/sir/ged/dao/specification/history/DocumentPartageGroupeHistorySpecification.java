package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentPartageGroupeHistoryCriteria;
import ma.sir.ged.bean.history.DocumentPartageGroupeHistory;


public class DocumentPartageGroupeHistorySpecification extends AbstractHistorySpecification<DocumentPartageGroupeHistoryCriteria, DocumentPartageGroupeHistory> {

    public DocumentPartageGroupeHistorySpecification(DocumentPartageGroupeHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentPartageGroupeHistorySpecification(DocumentPartageGroupeHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
