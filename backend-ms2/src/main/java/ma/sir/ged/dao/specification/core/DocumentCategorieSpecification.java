package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.DocumentCategorieCriteria;
import ma.sir.ged.bean.core.referentieldoc.DocumentCategorie;

public class DocumentCategorieSpecification extends  AbstractSpecification<DocumentCategorieCriteria, DocumentCategorie>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public DocumentCategorieSpecification(DocumentCategorieCriteria criteria) {
        super(criteria);
    }

    public DocumentCategorieSpecification(DocumentCategorieCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
