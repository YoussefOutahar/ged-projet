import { DocumentDto } from "app/controller/model/Document.model";
import { CommentaireDTO } from "app/controller/model/workflow/commentaireDTO";
import { StepPresetDTO } from "app/controller/model/workflow/stepPresetDTO";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";




export interface StepCriterial extends BaseCriteria { 
  
    stepLike: StepPresetDTO;
    statusLike?: StepDTO.StatusEnum;
    documentsLike?: Array<DocumentDto>;
    workflowIdLike: number;
    discussionsLike?: Array<CommentaireDTO>;
}
export namespace StepDTO {
    export type StatusEnum = 'WAITING' | 'IN_PROGRESS' | 'DONE';
    export const StatusEnum = {
        WAITING: 'WAITING' as StatusEnum,
        INPROGRESS: 'IN_PROGRESS' as StatusEnum,
        DONE: 'DONE' as StatusEnum
    };
}