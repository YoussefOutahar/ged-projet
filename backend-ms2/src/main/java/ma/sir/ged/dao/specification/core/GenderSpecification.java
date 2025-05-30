package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.GenderCriteria;
import ma.sir.ged.bean.core.organigramme.Gender;

public class GenderSpecification extends  AbstractSpecification<GenderCriteria, Gender>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public GenderSpecification(GenderCriteria criteria) {
        super(criteria);
    }

    public GenderSpecification(GenderCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
