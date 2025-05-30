package ma.sir.ged.dao.specification.core;

import ma.sir.ged.bean.core.organigramme.PlanClassementModel;

import ma.sir.ged.dao.criteria.core.PlanClassementModelCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;

public class PlanClassementModelSpecification extends AbstractSpecification<PlanClassementModelCriteria, PlanClassementModel> {
    public PlanClassementModelSpecification(PlanClassementModelCriteria criteria) {
        super(criteria);
    }

    public PlanClassementModelSpecification(PlanClassementModelCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
    }
}
