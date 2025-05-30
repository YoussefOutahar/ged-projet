import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";

export class PlanClassementCriteria extends BaseCriteria {

    public  code : string = "";
    public  codeLike : string = "";
    public  libelle : string = "";
    public  libelleLike : string = "";
    public  description : string = "";
    public  descriptionLike : string = "";

    
    private  archive : boolean = false;

    private planClassementCriteriaParent :PlanClassementCriteria | null = null  ;
    private planClassementCriteriaParents : PlanClassementCriteria[] = []  ;
}