import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { WorkflowDTO } from './workflow/workflowDTO';
import { StepDTO } from './workflow/stepDTO';
import { WorkflowPresetDTO } from './workflow/workflowPresetDTO';
import { WorkflowPreset } from './workflow/workflowPreset';
import { DocumentDto } from './Document.model';

export class WorkflowDto extends BaseDto {

    public title: string;
    public description?: string;
    public status: WorkflowDTO.StatusEnum;
    public flag: WorkflowDTO.FlagEnum;
    public documents?: Array<DocumentDto>;
    public piecesJointes?: Array<DocumentDto>;
    public dateC: string;
    public dateUpdate: string;  
    public initiateurId: number;
    public initiateurNom: string;
    public stepDTOList?: StepDTO[];
    public workflowPresetDTO?: WorkflowPreset;

    constructor() {
        super();
        this.title = '';
        this.description = '';
        this.status = WorkflowDTO.StatusEnum.CLOSED;
        this.flag = WorkflowDTO.FlagEnum.NORMALE;
        this.documents = [];
        this.piecesJointes = [];
        this.dateC = '';
        this.dateUpdate = '';
        this.initiateurId = 0;
        this.initiateurNom = '';
        this.stepDTOList = [];
        this.workflowPresetDTO = undefined;
    }
}
