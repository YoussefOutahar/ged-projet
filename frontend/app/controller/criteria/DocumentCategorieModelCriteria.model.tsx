import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { DocumentCategorieCriteria } from './DocumentCategorieCriteria.model';




export class DocumentCategorieModelCriteria extends BaseCriteria {


  public code: string;
  public codeLike: string;
  public libelle: string;
  public libelleLike: string;
  public description: string;
  public descriptionLike: string;
  public documentCategorie: DocumentCategorieCriteria;
  public documentCategories: Array<DocumentCategorieCriteria>;

  constructor() {
    super();
    this.code = '';
    this.codeLike = '';
    this.libelle = '';
    this.libelleLike = '';
    this.description = '';
    this.descriptionLike = '';
    this.documentCategorie = new DocumentCategorieCriteria();
    this.documentCategories = new Array<DocumentCategorieCriteria>();
  }

}
