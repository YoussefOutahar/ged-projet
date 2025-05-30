package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.UtilisateurHistoryCriteria;
import ma.sir.ged.bean.history.UtilisateurHistory;


public class UtilisateurHistorySpecification extends AbstractHistorySpecification<UtilisateurHistoryCriteria, UtilisateurHistory> {

    public UtilisateurHistorySpecification(UtilisateurHistoryCriteria criteria) {
        super(criteria);
    }

    public UtilisateurHistorySpecification(UtilisateurHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
