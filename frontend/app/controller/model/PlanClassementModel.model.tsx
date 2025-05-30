import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { PlanClassementModelIndexDto } from './PlanClassementModelIndex.model';


export class PlanClassementModelDto extends BaseDto {

    public code: string;
    public libelle: string;
    public description: string;
    public planClassementModelIndexDtos?: PlanClassementModelIndexDto[];


    constructor() {
        super();
        this.code = '';
        this.libelle = '';
        this.description = '';
        this.planClassementModelIndexDtos = [];

    }

}
