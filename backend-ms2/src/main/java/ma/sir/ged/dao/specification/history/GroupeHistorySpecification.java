package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.GroupeHistoryCriteria;
import ma.sir.ged.bean.history.GroupeHistory;


public class GroupeHistorySpecification extends AbstractHistorySpecification<GroupeHistoryCriteria, GroupeHistory> {

    public GroupeHistorySpecification(GroupeHistoryCriteria criteria) {
        super(criteria);
    }

    public GroupeHistorySpecification(GroupeHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
