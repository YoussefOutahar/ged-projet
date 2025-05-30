package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.TagCriteria;
import ma.sir.ged.bean.core.referentieldoc.Tag;

public class TagSpecification extends  AbstractSpecification<TagCriteria, Tag>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public TagSpecification(TagCriteria criteria) {
        super(criteria);
    }

    public TagSpecification(TagCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
