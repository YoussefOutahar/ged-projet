package ma.sir.ged.dao.criteria.core;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.criteria.BaseCriteria;

import java.util.List;


@Getter
@Setter
public class PlanClassementModelIndexCriteria extends BaseCriteria {

    private PlanClassementIndexCriteria planClassementIndex ;
    private List<PlanClassementIndexCriteria> planClassementIndexs ;

    private PlanClassementModelCriteria planClassementModel ;
    private List<PlanClassementModelCriteria> planClassementModels ;

    public PlanClassementModelIndexCriteria() {
    }
}
