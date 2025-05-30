package ma.sir.ged.dao.specification.history;

import ma.sir.ged.bean.history.PlanClassementIndexHistory;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexHistoryCriteria;
import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;

public class PlanClassementIndexHistorySpecification extends AbstractHistorySpecification<PlanClassementIndexHistoryCriteria, PlanClassementIndexHistory> {
    public PlanClassementIndexHistorySpecification(PlanClassementIndexHistoryCriteria criteria) {
        super(criteria);
    }

    public PlanClassementIndexHistorySpecification(PlanClassementIndexHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }
}
