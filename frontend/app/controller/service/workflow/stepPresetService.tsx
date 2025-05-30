import { StepPresetCriterial } from "app/controller/criteria/workflow/StepPresetCriterial.model";
import { StepPresetDTO } from "app/controller/model/workflow/stepPresetDTO";
import AbstractService from "app/zynerator/service/AbstractService";
import axiosConf from 'app/axiosInterceptor';


const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class stepPresetService extends AbstractService<StepPresetDTO, StepPresetCriterial>{


    constructor() {
        super(WORKFLOW_URL, 'stepPreset/');
    }

    static getStepPresetByWorkflow(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}stepPreset/workflow/${workflowId}`);
    }

    static getStepPresetById(stepPresetId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}stepPreset/${stepPresetId}`);
    }


}
