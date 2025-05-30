import AbstractService from "app/zynerator/service/AbstractService"

import axiosConf from 'app/axiosInterceptor';
import { WorkflowPreset } from "app/controller/model/workflow/workflowPreset";
import { WorkflowPresetCriteria } from "app/controller/criteria/workflow/workflowPresetCriteria.model";
import { WorkflowPresetDTO } from "app/controller/model/workflow/workflowPresetDTO";

const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class WorkflowPresetService  extends AbstractService<WorkflowPreset, WorkflowPresetCriteria>{
   

    constructor() {
        super(WORKFLOW_URL, 'workflowPresets/');
    }

     static getWorkflowPresetById(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflowPresets/${workflowId}`);
    }

     static getAllWorkflowsPreset(): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflowPresets/All`);
    }
    static getAllWorkflowsPresetByEntite(libelle: string): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflowPresets/departement/${libelle}`);
    }

    createWorkflowPreset(workflowPresetDTO: WorkflowPresetDTO): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflowPresets/`, workflowPresetDTO);
    }

     static updateWorkflowPreset(workflowPresetDTO: WorkflowPresetDTO): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}workflowPresets/`, workflowPresetDTO);
    }

    static DeleteWorkflowPresetById(workflowId: number): Promise<any> {
        return axiosConf.delete(`${WORKFLOW_URL}workflowPresets/${workflowId}`);
    }




    

}