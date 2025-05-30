import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { DocumentCategorieIndexCriteria } from './DocumentCategorieIndexCriteria.model';
import { DocumentCategorieModelCriteria } from './DocumentCategorieModelCriteria.model';




export class DocumentCategorieCriteria extends BaseCriteria {

  public codeLike: string;
  public libelleLike: string;
  public descriptionLike: string;
  public documentCategorieIndexs!: Array<DocumentCategorieIndexCriteria>;
  public documentCategorieModels!: Array<DocumentCategorieModelCriteria>;

  constructor() {
    super();
    this.codeLike = '';
    this.libelleLike = '';
    this.descriptionLike = '';
  }

}
