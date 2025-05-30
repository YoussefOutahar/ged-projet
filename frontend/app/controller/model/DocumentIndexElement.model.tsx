import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { IndexElementDto } from 'app/controller/model/IndexElement.model';
import { DocumentDto } from 'app/controller/model/Document.model';

export class DocumentIndexElementDto extends BaseDto {

    public value: string;
    public description: string;
    public indexElement: IndexElementDto;
    public document: DocumentDto;


    constructor() {
        super();
        this.value = '';
        this.description = '';
        this.indexElement = new IndexElementDto();
        this.document = new DocumentDto();
    }

}
