import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

export class DocumentStateCriteria extends BaseCriteria {

    public codeLike: string;
    public libelleLike: string;
    public styleLike: string;
    public descriptionLike: string;

    constructor() {
        super();
        this.codeLike = '';
        this.libelleLike = '';
        this.styleLike = '';
        this.descriptionLike = '';
    }

}
