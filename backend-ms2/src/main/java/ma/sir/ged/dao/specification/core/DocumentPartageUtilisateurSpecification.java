package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.DocumentPartageUtilisateurCriteria;
import ma.sir.ged.bean.core.referentielpartage.DocumentPartageUtilisateur;

public class DocumentPartageUtilisateurSpecification extends  AbstractSpecification<DocumentPartageUtilisateurCriteria, DocumentPartageUtilisateur>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("dateShare", criteria.getDateShare(), criteria.getDateShareFrom(), criteria.getDateShareTo());
        addPredicateFk("document","id", criteria.getDocument()==null?null:criteria.getDocument().getId());
        addPredicateFk("document","id", criteria.getDocuments());
        addPredicateFk("document","reference", criteria.getDocument()==null?null:criteria.getDocument().getReference());
        addPredicateFk("utilisateur","id", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getId());
        addPredicateFk("utilisateur","id", criteria.getUtilisateurs());
        addPredicateFk("utilisateur","email", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getEmail());
        addPredicateFk("accessShare","id", criteria.getAccessShare()==null?null:criteria.getAccessShare().getId());
        addPredicateFk("accessShare","id", criteria.getAccessShares());
        addPredicateFk("accessShare","code", criteria.getAccessShare()==null?null:criteria.getAccessShare().getCode());
    }

    public DocumentPartageUtilisateurSpecification(DocumentPartageUtilisateurCriteria criteria) {
        super(criteria);
    }

    public DocumentPartageUtilisateurSpecification(DocumentPartageUtilisateurCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
