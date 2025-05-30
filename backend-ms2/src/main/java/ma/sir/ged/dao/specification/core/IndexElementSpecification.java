package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.IndexElementCriteria;
import ma.sir.ged.bean.core.referentieldoc.IndexElement;

public class IndexElementSpecification extends  AbstractSpecification<IndexElementCriteria, IndexElement>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public IndexElementSpecification(IndexElementCriteria criteria) {
        super(criteria);
    }

    public IndexElementSpecification(IndexElementCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
