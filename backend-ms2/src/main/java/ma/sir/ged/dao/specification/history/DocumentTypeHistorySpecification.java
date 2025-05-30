package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentTypeHistoryCriteria;
import ma.sir.ged.bean.history.DocumentTypeHistory;


public class DocumentTypeHistorySpecification extends AbstractHistorySpecification<DocumentTypeHistoryCriteria, DocumentTypeHistory> {

    public DocumentTypeHistorySpecification(DocumentTypeHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentTypeHistorySpecification(DocumentTypeHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
