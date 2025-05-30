import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { TagDto } from 'app/controller/model/Tag.model';
import { DocumentDto } from 'app/controller/model/Document.model';

export class DocumentTagDto extends BaseDto {

    public document: DocumentDto;
    public tag: TagDto;

    constructor() {
        super();
        this.document = new DocumentDto();
        this.tag = new TagDto();
    }

}
