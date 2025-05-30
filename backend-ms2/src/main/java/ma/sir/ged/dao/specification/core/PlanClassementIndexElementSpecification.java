package ma.sir.ged.dao.specification.core;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndexElement;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexElementCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;

public class PlanClassementIndexElementSpecification extends AbstractSpecification<PlanClassementIndexElementCriteria, PlanClassementIndexElement> {
    public PlanClassementIndexElementSpecification(PlanClassementIndexElementCriteria criteria) {
        super(criteria);
    }

    public PlanClassementIndexElementSpecification(PlanClassementIndexElementCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("value", criteria.getValue(), criteria.getValueLike());
    }


}
