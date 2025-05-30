package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.GroupeUtilisateurHistoryCriteria;
import ma.sir.ged.bean.history.GroupeUtilisateurHistory;


public class GroupeUtilisateurHistorySpecification extends AbstractHistorySpecification<GroupeUtilisateurHistoryCriteria, GroupeUtilisateurHistory> {

    public GroupeUtilisateurHistorySpecification(GroupeUtilisateurHistoryCriteria criteria) {
        super(criteria);
    }

    public GroupeUtilisateurHistorySpecification(GroupeUtilisateurHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
