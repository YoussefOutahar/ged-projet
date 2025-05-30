
import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { StepPresetDTO } from 'app/controller/model/workflow/stepPresetDTO';

export class WorkflowPreset  extends BaseDto{
  

    label?: string;
    dateC?: string;
    dateUpdate?: string;
    createurNom?: string;
    createurPrenom?: string;
    title: string;
    stepPresets?: Array<StepPresetDTO>;
    description?: string;
    createurId?: number;
    departement?: string;




    constructor() {
        super();
        this.title = '';
        this.description ='';
        this.createurNom ="";
        this.createurPrenom ="";
        this.dateC="";
        this.dateUpdate="";
        this.createurId = 0;
        

    }
}
