package ma.sir.ged.dao.specification.history;

import ma.sir.ged.bean.history.PlanClassementIndexElementHistory;
import ma.sir.ged.dao.criteria.history.PlanClassementIndexElementHistoryCriteria;
import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;

public class PlanClassementIndexElementHistorySpecification extends AbstractHistorySpecification<PlanClassementIndexElementHistoryCriteria, PlanClassementIndexElementHistory> {
    public PlanClassementIndexElementHistorySpecification(PlanClassementIndexElementHistoryCriteria criteria) {
        super(criteria);
    }

    public PlanClassementIndexElementHistorySpecification(PlanClassementIndexElementHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }
}
