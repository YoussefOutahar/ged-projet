import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";
import { th } from "date-fns/locale";
import { PlanClassementModelIndexCriteria } from "./PlanClassementModelIndexCriteria.model";

export class PlanClassementModelCriteria extends BaseCriteria {
    public code: string;
    public codeLike: string;
    public description: string;
    public descriptionLike: string;
    public libelle: string;
    public libelleLike: string;

    public planClassementIndexs : PlanClassementModelIndexCriteria[] = [];

    constructor() {
        super();
        this.codeLike = '';
        this.descriptionLike = '';
        this.libelleLike = '';
        this.code = '';
        this.description = '';
        this.libelle = '';
    }

}