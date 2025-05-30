package ma.sir.ged.dao.specification.history;

import ma.sir.ged.bean.history.PlanClassementModelHistory;
import ma.sir.ged.dao.criteria.history.PlanClassementModelHistoryCriteria;
import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;

public class PlanClassementModelHistorySpecification extends AbstractHistorySpecification<PlanClassementModelHistoryCriteria, PlanClassementModelHistory> {
    public PlanClassementModelHistorySpecification(PlanClassementModelHistoryCriteria criteria) {
        super(criteria);
    }

    public PlanClassementModelHistorySpecification(PlanClassementModelHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }
}
