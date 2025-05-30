import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";

export class PlanClassementIndexCriteria extends BaseCriteria {
    public  code : string = "";
    public  codeLike : string = "";
    public  libelle : string = "";
    public  libelleLike : string = "";
    public  description : string = "";
    public  descriptionLike : string = ""; 
}