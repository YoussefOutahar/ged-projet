package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.GroupeCriteria;
import ma.sir.ged.bean.core.referentielpartage.Groupe;

public class GroupeSpecification extends  AbstractSpecification<GroupeCriteria, Groupe>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("code", criteria.getCode(),criteria.getCodeLike());
        addPredicate("libelle", criteria.getLibelle(),criteria.getLibelleLike());
        addPredicateFk("utilisateur","id", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getId());
        addPredicateFk("utilisateur","id", criteria.getUtilisateurs());
        addPredicateFk("utilisateur","email", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getEmail());
    }

    public GroupeSpecification(GroupeCriteria criteria) {
        super(criteria);
    }

    public GroupeSpecification(GroupeCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
