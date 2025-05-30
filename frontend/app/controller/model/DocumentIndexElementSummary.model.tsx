import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

export class DocumentIndexElementSummaryDto extends BaseDto {

    public value : string;
    public description : string;
    public indexElementId : null | number;
    public documentId : null | number;
    constructor() {
        super();
        this.value = '';
        this.description = '';
        this.indexElementId = null;
        this.documentId = null;
    }

}
