package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.GroupeUtilisateurCriteria;
import ma.sir.ged.bean.core.referentielpartage.GroupeUtilisateur;

public class GroupeUtilisateurSpecification extends  AbstractSpecification<GroupeUtilisateurCriteria, GroupeUtilisateur>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("dateAjout", criteria.getDateAjout(), criteria.getDateAjoutFrom(), criteria.getDateAjoutTo());
        addPredicateFk("groupe","id", criteria.getGroupe()==null?null:criteria.getGroupe().getId());
        addPredicateFk("groupe","id", criteria.getGroupes());
        addPredicateFk("groupe","code", criteria.getGroupe()==null?null:criteria.getGroupe().getCode());
        addPredicateFk("utilisateur","id", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getId());
        addPredicateFk("utilisateur","id", criteria.getUtilisateurs());
        addPredicateFk("utilisateur","email", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getEmail());
        addPredicateFk("etatUtilisateur","id", criteria.getEtatUtilisateur()==null?null:criteria.getEtatUtilisateur().getId());
        addPredicateFk("etatUtilisateur","id", criteria.getEtatUtilisateurs());
        addPredicateFk("etatUtilisateur","code", criteria.getEtatUtilisateur()==null?null:criteria.getEtatUtilisateur().getCode());
        addPredicateFk("roleUtilisateur","id", criteria.getRoleUtilisateur()==null?null:criteria.getRoleUtilisateur().getId());
        addPredicateFk("roleUtilisateur","id", criteria.getRoleUtilisateurs());
        addPredicateFk("roleUtilisateur","code", criteria.getRoleUtilisateur()==null?null:criteria.getRoleUtilisateur().getCode());
    }

    public GroupeUtilisateurSpecification(GroupeUtilisateurCriteria criteria) {
        super(criteria);
    }

    public GroupeUtilisateurSpecification(GroupeUtilisateurCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
