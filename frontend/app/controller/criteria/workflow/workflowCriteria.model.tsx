
import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';
import { Step } from 'app/controller/model/workflow/step';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';

export class WorkflowCriteria extends BaseCriteria { 
    labelLike?: string;
    readonly createdOnLike?: Date;
    readonly updatedOnLike?: Date;
    readonly createdByLike?: string;
    readonly updatedByLike?: string;
    idd?: number;
    titleLike?: string;
    descriptionLike?: string;
    statusLike?: Workflow.StatusEnum;
    flagLike?: Workflow.FlagEnum;
    stepListLike?: Array<Step>;
    initiateurLike?: UtilisateurDto;
}
export namespace Workflow {
    export type StatusEnum = 'OPEN' | 'CLOSED';
    export const StatusEnum = {
        OPEN: 'OPEN' as StatusEnum,
        CLOSED: 'CLOSED' as StatusEnum
    };
    export type FlagEnum = 'URGENT' | 'NORMALE';
    export const FlagEnum = {
        URGENT: 'URGENT' as FlagEnum,
        NORMALE: 'NORMALE' as FlagEnum
    };
}