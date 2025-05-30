import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";
import { PlanClassementModelCriteria } from "./PlanClassementModelCriteria.model";
import { PlanClassementIndexCriteria } from "./PlanClassementIndexCriteria.model";

export class PlanClassementModelIndexCriteria extends BaseCriteria {
    
    public planClassementIndex: PlanClassementIndexCriteria = new PlanClassementIndexCriteria();
    public planClassementIndexs : PlanClassementIndexCriteria[] = [];

    public planClassementModel: PlanClassementModelCriteria = new PlanClassementModelCriteria();
    public planClassementModels : PlanClassementModelCriteria[] = [];
}