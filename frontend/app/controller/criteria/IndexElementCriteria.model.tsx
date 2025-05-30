import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

export class IndexElementCriteria extends BaseCriteria {
    public codeLike: string;
    public libelleLike: string;
    public descriptionLike: string;

    constructor() {
        super();
        this.codeLike = '';
        this.libelleLike = '';
        this.descriptionLike = '';
    }

}
