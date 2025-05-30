import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { IndexElementCriteria } from './IndexElementCriteria.model';
import { DocumentCriteria } from './DocumentCriteria.model';

export class DocumentIndexElementCriteria extends BaseCriteria {

  public value: string;
  public valueLike: string;
  public description: string;
  public descriptionLike: string;
  public indexElement: IndexElementCriteria;
  public indexElements: Array<IndexElementCriteria>;
  public document: DocumentCriteria;
  public documents: Array<DocumentCriteria>;

  constructor() {
    super();
    this.value = '';
    this.valueLike = '';
    this.description = '';
    this.descriptionLike = '';
    this.indexElement = new IndexElementCriteria();
    this.indexElements = new Array<IndexElementCriteria>();
    this.document = new DocumentCriteria();
    this.documents = new Array<DocumentCriteria>();
  }

}
