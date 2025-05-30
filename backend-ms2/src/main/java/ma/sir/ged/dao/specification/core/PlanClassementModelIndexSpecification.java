package ma.sir.ged.dao.specification.core;

import ma.sir.ged.bean.core.organigramme.PlanClassementModelIndex;
import ma.sir.ged.dao.criteria.core.PlanClassementModelIndexCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;

public class PlanClassementModelIndexSpecification extends AbstractSpecification<PlanClassementModelIndexCriteria, PlanClassementModelIndex> {
    public PlanClassementModelIndexSpecification(PlanClassementModelIndexCriteria criteria) {
        super(criteria);
    }

    public PlanClassementModelIndexSpecification(PlanClassementModelIndexCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
    }
}
