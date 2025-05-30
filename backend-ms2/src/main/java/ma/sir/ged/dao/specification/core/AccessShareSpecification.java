package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.AccessShareCriteria;
import ma.sir.ged.bean.core.referentielpartage.AccessShare;

public class AccessShareSpecification extends  AbstractSpecification<AccessShareCriteria, AccessShare>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public AccessShareSpecification(AccessShareCriteria criteria) {
        super(criteria);
    }

    public AccessShareSpecification(AccessShareCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
