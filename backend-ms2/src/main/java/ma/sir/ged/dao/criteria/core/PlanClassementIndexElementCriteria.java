package ma.sir.ged.dao.criteria.core;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.criteria.BaseCriteria;

import java.util.List;


@Getter
@Setter
public class PlanClassementIndexElementCriteria extends BaseCriteria {

    private String value;
    private String valueLike;
    private String description;
    private String descriptionLike;

    private PlanClassementIndexCriteria planClassementIndex ;
    private List<PlanClassementIndexCriteria> planClassementIndexs ;

    private PlanClassementCriteria planClassement ;
    private List<PlanClassementCriteria> planClassements ;

    public PlanClassementIndexElementCriteria() {
    }

}
