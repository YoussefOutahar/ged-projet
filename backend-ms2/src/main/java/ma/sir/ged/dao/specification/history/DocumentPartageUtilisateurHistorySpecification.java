package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.DocumentPartageUtilisateurHistoryCriteria;
import ma.sir.ged.bean.history.DocumentPartageUtilisateurHistory;


public class DocumentPartageUtilisateurHistorySpecification extends AbstractHistorySpecification<DocumentPartageUtilisateurHistoryCriteria, DocumentPartageUtilisateurHistory> {

    public DocumentPartageUtilisateurHistorySpecification(DocumentPartageUtilisateurHistoryCriteria criteria) {
        super(criteria);
    }

    public DocumentPartageUtilisateurHistorySpecification(DocumentPartageUtilisateurHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
