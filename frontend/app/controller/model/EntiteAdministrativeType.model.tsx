import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
export class EntiteAdministrativeTypeDto extends BaseDto {

    public code: string;
    public libelle: string;
    public description: string;
    public rang: number;

    constructor() {
        super();
        this.code = '';
        this.libelle = '';
        this.description = '';
        this.rang = 0;
    }

}
