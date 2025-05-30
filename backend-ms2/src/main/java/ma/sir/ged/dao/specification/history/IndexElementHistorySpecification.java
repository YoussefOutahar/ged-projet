package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.IndexElementHistoryCriteria;
import ma.sir.ged.bean.history.IndexElementHistory;


public class IndexElementHistorySpecification extends AbstractHistorySpecification<IndexElementHistoryCriteria, IndexElementHistory> {

    public IndexElementHistorySpecification(IndexElementHistoryCriteria criteria) {
        super(criteria);
    }

    public IndexElementHistorySpecification(IndexElementHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
