package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.DocumentPartageGroupeCriteria;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageGroupe;

public class DocumentPartageGroupeSpecification extends  AbstractSpecification<DocumentPartageGroupeCriteria, DocumentPartageGroupe>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("dateShare", criteria.getDateShare(), criteria.getDateShareFrom(), criteria.getDateShareTo());
        addPredicateFk("document","id", criteria.getDocument()==null?null:criteria.getDocument().getId());
        addPredicateFk("document","id", criteria.getDocuments());
        addPredicateFk("document","reference", criteria.getDocument()==null?null:criteria.getDocument().getReference());
        addPredicateFk("groupe","id", criteria.getGroupe()==null?null:criteria.getGroupe().getId());
        addPredicateFk("groupe","id", criteria.getGroupes());
        addPredicateFk("groupe","code", criteria.getGroupe()==null?null:criteria.getGroupe().getCode());
        addPredicateFk("accessShare","id", criteria.getAccessShare()==null?null:criteria.getAccessShare().getId());
        addPredicateFk("accessShare","id", criteria.getAccessShares());
        addPredicateFk("accessShare","code", criteria.getAccessShare()==null?null:criteria.getAccessShare().getCode());
    }

    public DocumentPartageGroupeSpecification(DocumentPartageGroupeCriteria criteria) {
        super(criteria);
    }

    public DocumentPartageGroupeSpecification(DocumentPartageGroupeCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
