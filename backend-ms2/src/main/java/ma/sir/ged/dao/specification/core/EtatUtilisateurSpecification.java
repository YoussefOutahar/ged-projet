package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.EtatUtilisateurCriteria;
import ma.sir.ged.bean.core.referentielpartage.EtatUtilisateur;

public class EtatUtilisateurSpecification extends  AbstractSpecification<EtatUtilisateurCriteria, EtatUtilisateur>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
    }

    public EtatUtilisateurSpecification(EtatUtilisateurCriteria criteria) {
        super(criteria);
    }

    public EtatUtilisateurSpecification(EtatUtilisateurCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
