import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';

export class DocumentCategorieDto extends BaseDto {

    public code: string;
    public libelle: string;
    public description: string;
    public documentCategorieIndexs: Array<DocumentCategorieIndexDto>;
    public documentCategorieModels: Array<DocumentCategorieModelDto>;


    constructor() {
        super();
        this.code = '';
        this.libelle = '';
        this.description = '';
        this.documentCategorieIndexs = new Array<DocumentCategorieIndexDto>();
        this.documentCategorieModels = new Array<DocumentCategorieModelDto>();
    }

}
