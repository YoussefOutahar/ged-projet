import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { PlanClassementDto } from './PlanClassement.model';
import { PlanClassementIndexDto } from './PlanClassementIndex.model';

export class PlanClassementIndexElementDto extends BaseDto {

    public value: string;
    public description: string;
    public indexElement: PlanClassementIndexDto;
    public planClassement: PlanClassementDto;


    constructor() {
        super();
        this.value = '';
        this.description = '';
        this.indexElement = new PlanClassementIndexDto();
        this.planClassement = new PlanClassementDto();
    }

}
