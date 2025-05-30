import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

export class
DocumentCategorieIndexRuleCriteria extends BaseCriteria {


    public codeLike: string;
    public libelleLike: string;
    public expresionLike: string;
    public descriptionLike: string;

    constructor() {
        super();
        this.codeLike = '';
        this.libelleLike = '';
        this.expresionLike = '';
        this.descriptionLike = '';
    }

}
