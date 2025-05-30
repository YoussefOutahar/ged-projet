import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';

export class DocumentCategorieModelDto extends BaseDto {

    public code: string;
    public libelle: string;
    public description: string;
    public documentCategorie: DocumentCategorieDto;

    constructor() {
        super();
        this.code = '';
        this.libelle = '';
        this.description = '';
        this.documentCategorie = new DocumentCategorieDto();
    }

}
