package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.RoleUtilisateurHistoryCriteria;
import ma.sir.ged.bean.history.RoleUtilisateurHistory;


public class RoleUtilisateurHistorySpecification extends AbstractHistorySpecification<RoleUtilisateurHistoryCriteria, RoleUtilisateurHistory> {

    public RoleUtilisateurHistorySpecification(RoleUtilisateurHistoryCriteria criteria) {
        super(criteria);
    }

    public RoleUtilisateurHistorySpecification(RoleUtilisateurHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
