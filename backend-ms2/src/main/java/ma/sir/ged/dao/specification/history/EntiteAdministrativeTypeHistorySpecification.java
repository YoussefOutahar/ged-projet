package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.EntiteAdministrativeTypeHistoryCriteria;
import ma.sir.ged.bean.history.EntiteAdministrativeTypeHistory;


public class EntiteAdministrativeTypeHistorySpecification extends AbstractHistorySpecification<EntiteAdministrativeTypeHistoryCriteria, EntiteAdministrativeTypeHistory> {

    public EntiteAdministrativeTypeHistorySpecification(EntiteAdministrativeTypeHistoryCriteria criteria) {
        super(criteria);
    }

    public EntiteAdministrativeTypeHistorySpecification(EntiteAdministrativeTypeHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
