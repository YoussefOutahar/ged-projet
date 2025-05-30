package ma.sir.ged.dao.specification.history;

import ma.sir.ged.bean.history.PlanClassementModelIndexHistory;
import ma.sir.ged.dao.criteria.history.PlanClassementModelIndexHistoryCriteria;
import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;

public class PlanClassementModelIndexHistorySpecification extends AbstractHistorySpecification<PlanClassementModelIndexHistoryCriteria, PlanClassementModelIndexHistory> {
    public PlanClassementModelIndexHistorySpecification(PlanClassementModelIndexHistoryCriteria criteria) {
        super(criteria);
    }

    public PlanClassementModelIndexHistorySpecification(PlanClassementModelIndexHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }
}
