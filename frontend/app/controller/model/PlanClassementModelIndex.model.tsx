import {BaseDto} from 'app/zynerator/dto/BaseDto.model';

import { PlanClassementIndexDto } from './PlanClassementIndex.model';
import { PlanClassementModelDto } from './PlanClassementModel.model';

export class PlanClassementModelIndexDto extends BaseDto{

    public planClassementIndex: PlanClassementIndexDto ;
    public planClassementModel: PlanClassementModelDto ;


    constructor() {
        super();
        this.planClassementIndex = new PlanClassementIndexDto() ;
        this.planClassementModel = new PlanClassementModelDto() ;
        }

}
