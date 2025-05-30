import { PlanClassementIndexCriteria } from "./PlanClassementIndexCriteria.model";
import { PlanClassementCriteria } from "./PlanClassementCriteria.model";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";

export class PlanClassementIndexElementCriteria extends BaseCriteria{

    private value: string = '';
    private valueLike :string = '';
    private description : string = '';
    private descriptionLike: string = '';

    private planClassementIndex : PlanClassementIndexCriteria = new PlanClassementIndexCriteria() ;
    private planClassementIndexs : PlanClassementIndexCriteria[] = [] ;

    private planClassement : PlanClassementCriteria = new PlanClassementCriteria();
    private planClassements : PlanClassementCriteria[] = [] ;
}