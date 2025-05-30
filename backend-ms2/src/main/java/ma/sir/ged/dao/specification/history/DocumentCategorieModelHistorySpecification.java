package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentCategorieModelHistoryCriteria;
import ma.sir.ged.bean.history.DocumentCategorieModelHistory;


public class DocumentCategorieModelHistorySpecification extends AbstractHistorySpecification<DocumentCategorieModelHistoryCriteria, DocumentCategorieModelHistory> {

    public DocumentCategorieModelHistorySpecification(DocumentCategorieModelHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentCategorieModelHistorySpecification(DocumentCategorieModelHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
