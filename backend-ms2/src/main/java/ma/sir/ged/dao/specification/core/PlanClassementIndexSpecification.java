package ma.sir.ged.dao.specification.core;

import ma.sir.ged.bean.core.organigramme.PlanClassementIndex;
import ma.sir.ged.dao.criteria.core.PlanClassementIndexCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;

public class PlanClassementIndexSpecification extends AbstractSpecification<PlanClassementIndexCriteria, PlanClassementIndex> {
    public PlanClassementIndexSpecification(PlanClassementIndexCriteria criteria) {
        super(criteria);
    }

    public PlanClassementIndexSpecification(PlanClassementIndexCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(), criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(), criteria.getLibelleLike());
    }
}
