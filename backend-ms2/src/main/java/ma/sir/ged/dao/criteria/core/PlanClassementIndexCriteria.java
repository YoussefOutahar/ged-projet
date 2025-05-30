package ma.sir.ged.dao.criteria.core;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import ma.sir.ged.zynerator.criteria.BaseCriteria;

@Getter
@Setter
public class PlanClassementIndexCriteria extends BaseCriteria {

    private String code;
    private String codeLike;
    private String libelle;
    private String libelleLike;
    private String description;
    private String descriptionLike;

    public PlanClassementIndexCriteria() {}
}
