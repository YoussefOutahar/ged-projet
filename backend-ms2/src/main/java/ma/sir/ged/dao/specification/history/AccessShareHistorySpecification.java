package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.AccessShareHistoryCriteria;
import ma.sir.ged.bean.history.AccessShareHistory;


public class AccessShareHistorySpecification extends AbstractHistorySpecification<AccessShareHistoryCriteria, AccessShareHistory> {

    public AccessShareHistorySpecification(AccessShareHistoryCriteria criteria) {
        super(criteria);
    }

    public AccessShareHistorySpecification(AccessShareHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
