
import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { UtilisateurDto } from '../Utilisateur.model';
import { Step } from './step';
import { WorkflowPreset } from './workflowPreset';
import { DocumentDto } from '../Document.model';

export class Workflow extends BaseDto { 
    label?: string;
    readonly createdOn?: Date;
    readonly updatedOn?: Date;
    readonly createdBy?: string;
    readonly updatedBy?: string;
    idd?: number;
    title?: string;
    description?: string;
    status?: Workflow.StatusEnum;
    flag?: Workflow.FlagEnum;
    stepList?: Array<Step>;
    initiateurId?: number ;
    workflowPresteId?: number ;
    workflowPreset?:WorkflowPreset
    workflowPresetTitle?: string ;
    initiateurNom?: string ;
    documents?: Array<DocumentDto>;

}
export namespace Workflow {
    export type StatusEnum = 'OPEN' | 'CLOSED' |'REJECTED'| 'Annulled' | 'REOPENED';
    export const StatusEnum = {
        OPEN: 'OPEN' as StatusEnum,
        CLOSED: 'CLOSED' as StatusEnum,
        REJECTED: 'REJECTED' as StatusEnum,
        Annulled: 'Annulled' as StatusEnum,
        REOPENED: 'REOPENED' as StatusEnum
    };
    export type FlagEnum = 'URGENT' | 'NORMALE';
    export const FlagEnum = {
        URGENT: 'URGENT' as FlagEnum,
        NORMALE: 'NORMALE' as FlagEnum
    };
}