import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

export class TagCriteria extends BaseCriteria {

    public code: string;
    public codeLike: string;
    public libelle: string;
    public libelleLike: string;
    public description: string;
    public descriptionLike: string;

    constructor() {
        super();
        this.code = '';
        this.codeLike = '';
        this.libelle = '';
        this.libelleLike = '';
        this.description = '';
        this.descriptionLike = '';
    }

}
