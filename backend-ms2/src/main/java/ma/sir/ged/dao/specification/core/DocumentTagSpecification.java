package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.DocumentTagCriteria;
import ma.sir.ged.bean.core.referentieldoc.DocumentTag;

public class DocumentTagSpecification extends  AbstractSpecification<DocumentTagCriteria, DocumentTag>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicateFk("document","id", criteria.getDocument()==null?null:criteria.getDocument().getId());
        addPredicateFk("document","id", criteria.getDocuments());
        addPredicateFk("document","reference", criteria.getDocument()==null?null:criteria.getDocument().getReference());
        addPredicateFk("tag","id", criteria.getTag()==null?null:criteria.getTag().getId());
        addPredicateFk("tag","id", criteria.getTags());
        addPredicateFk("tag","code", criteria.getTag()==null?null:criteria.getTag().getCode());
    }

    public DocumentTagSpecification(DocumentTagCriteria criteria) {
        super(criteria);
    }

    public DocumentTagSpecification(DocumentTagCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
