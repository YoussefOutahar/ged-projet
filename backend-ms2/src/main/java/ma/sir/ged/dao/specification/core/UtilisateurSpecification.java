package  ma.sir.ged.dao.specification.core;

import ma.sir.ged.zynerator.specification.AbstractSpecification;
import ma.sir.ged.dao.criteria.core.UtilisateurCriteria;
import ma.sir.ged.bean.core.organigramme.Utilisateur;

public class UtilisateurSpecification extends  AbstractSpecification<UtilisateurCriteria, Utilisateur>  {

    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("email", criteria.getEmail(),criteria.getEmailLike());
        addPredicate("telephone", criteria.getTelephone(),criteria.getTelephoneLike());
        addPredicate("nom", criteria.getNom(),criteria.getNomLike());
        addPredicate("prenom", criteria.getPrenom(),criteria.getPrenomLike());
        addPredicate("dateNaissance", criteria.getDateNaissance(), criteria.getDateNaissanceFrom(), criteria.getDateNaissanceTo());
        addPredicateBool("credentialsNonExpired", criteria.getCredentialsNonExpired());
        addPredicateBool("enabled", criteria.getEnabled());
        addPredicateBool("accountNonExpired", criteria.getAccountNonExpired());
        addPredicateBool("accountNonLocked", criteria.getAccountNonLocked());
        addPredicateBool("passwordChanged", criteria.getPasswordChanged());
        addPredicate("username", criteria.getUsername(),criteria.getUsernameLike());
        addPredicate("password", criteria.getPassword(),criteria.getPasswordLike());
        addPredicateFk("gender","id", criteria.getGender()==null?null:criteria.getGender().getId());
        addPredicateFk("gender","id", criteria.getGenders());
        addPredicateFk("gender","code", criteria.getGender()==null?null:criteria.getGender().getCode());
        addPredicateFk("entiteAdministrative","id", criteria.getEntiteAdministrative()==null?null:criteria.getEntiteAdministrative().getId());
        addPredicateFk("entiteAdministrative","id", criteria.getEntiteAdministratives());
        addPredicateFk("entiteAdministrative","code", criteria.getEntiteAdministrative()==null?null:criteria.getEntiteAdministrative().getCode());
    }

    public UtilisateurSpecification(UtilisateurCriteria criteria) {
        super(criteria);
    }

    public UtilisateurSpecification(UtilisateurCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
