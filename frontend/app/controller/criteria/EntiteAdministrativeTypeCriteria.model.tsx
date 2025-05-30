import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

export class EntiteAdministrativeTypeCriteria extends BaseCriteria {

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
