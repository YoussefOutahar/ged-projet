import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { TagCriteria } from './TagCriteria.model';
import { DocumentCriteria } from './DocumentCriteria.model';

export class DocumentTagCriteria extends BaseCriteria {

  public document: DocumentCriteria;
  public documents: Array<DocumentCriteria>;
  public tag: TagCriteria;
  public tags: Array<TagCriteria>;

  constructor() {
    super();
    this.document = new DocumentCriteria();
    this.documents = new Array<DocumentCriteria>();
    this.tag = new TagCriteria();
    this.tags = new Array<TagCriteria>();
  }

}
