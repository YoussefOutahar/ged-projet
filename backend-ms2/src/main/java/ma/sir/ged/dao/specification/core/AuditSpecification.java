package ma.sir.ged.dao.specification.core;

import ma.sir.ged.bean.core.doc.Audit;
import ma.sir.ged.dao.criteria.core.AuditCriteria;
import ma.sir.ged.dao.criteria.core.DocumentStateCriteria;
import ma.sir.ged.zynerator.specification.AbstractSpecification;

public class AuditSpecification extends AbstractSpecification<AuditCriteria, Audit> {
    @Override
    public void constructPredicates() {
        addPredicateId("id", criteria);
        addPredicate("action", criteria.getAction(),criteria.getActionLike());
        addPredicateFk("utilisateur","id", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getId());
        addPredicateFk("utilisateur","id", criteria.getUtilisateurs());
        addPredicateFk("utilisateur","email", criteria.getUtilisateur()==null?null:criteria.getUtilisateur().getEmail());
        addPredicateFk("document","id", criteria.getDocument()==null?null:criteria.getDocument().getId());
        addPredicateFk("document","id", criteria.getDocuments());
        addPredicateFk("document","reference", criteria.getDocument()==null?null:criteria.getDocument().getReference());
    }

    public AuditSpecification(AuditCriteria criteria) {
        super(criteria);
    }

    public AuditSpecification(AuditCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
