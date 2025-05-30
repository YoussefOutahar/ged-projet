package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeHistoryCriteria;
import ma.sir.ged.bean.history.EntiteAdministrativeHistory;


public class EntiteAdministrativeHistorySpecification extends AbstractHistorySpecification<EntiteAdministrativeHistoryCriteria, EntiteAdministrativeHistory> {

    public EntiteAdministrativeHistorySpecification(EntiteAdministrativeHistoryCriteria criteria) {
        super(criteria);
    }

    public EntiteAdministrativeHistorySpecification(EntiteAdministrativeHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
