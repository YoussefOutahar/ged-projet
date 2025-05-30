package  ma.sir.ged.dao.specification.history;

import ma.sir.ged.zynerator.specification.AbstractHistorySpecification;
import ma.sir.ged.dao.criteria.history.TagHistoryCriteria;
import ma.sir.ged.bean.history.TagHistory;


public class TagHistorySpecification extends AbstractHistorySpecification<TagHistoryCriteria, TagHistory> {

    public TagHistorySpecification(TagHistoryCriteria criteria) {
        super(criteria);
    }

    public TagHistorySpecification(TagHistoryCriteria criteria, boolean distinct) {
        super(criteria, distinct);
    }

}
