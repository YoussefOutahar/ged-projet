package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.GenderHistoryCriteria;
import ma.sir.ged.bean.history.GenderHistory;


public class GenderHistorySpecification extends AbstractHistorySpecification<GenderHistoryCriteria, GenderHistory> {

    public GenderHistorySpecification(GenderHistoryCriteria criteria) {
        super(criteria);
    }

    public GenderHistorySpecification(GenderHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
