import { UserDestinataireDTO } from "app/controller/model/workflow/userDestinataireDTO";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";


export interface StepPresetCriterial extends BaseCriteria { 
    
    titleLike?: string;
    levelLike?: number;
    descriptionLike?: string;
    workflowPresetIdLike?: number;
    destinatairesLike?: Array<UserDestinataireDTO>;
    actionsLike?: ACTION[];
}
export namespace StepPresetDTO {
    export type ActionsEnum = 'CREATE' | 'UPDATE' | 'DELETE';
    export const ActionsEnum = {
        CREATE: 'CREATE' as ActionsEnum,
        UPDATE: 'UPDATE' as ActionsEnum,
        DELETE: 'DELETE' as ActionsEnum
    };
}
export enum ACTION {
    SIGN = 'SIGN',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
  }