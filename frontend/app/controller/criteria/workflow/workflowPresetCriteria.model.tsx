

import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';
import { StepPreset } from 'app/controller/model/workflow/stepPreset';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';


export class WorkflowPresetCriteria  extends BaseCriteria{ 
   
    label?: string;
    readonly createdOn?: Date;
    readonly updatedOn?: Date;
    readonly createdBy?: string;
    readonly updatedBy?: string;
    title?: string;
    stepPresetList?: Array<StepPreset>;
    description?: string;
    createur?: UtilisateurDto;
}