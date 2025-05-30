import  { AxiosResponse } from "axios";
import axiosConf from 'app/axiosInterceptor';
import axios from 'axios';

const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

import AbstractService from "app/zynerator/service/AbstractService";

import { WorkflowDto } from "app/controller/model/Workflow.model";
import { WorkflowCriteria } from "app/controller/criteria/workflow/workflowCriteria.model";
import { WorkflowDTO } from "app/controller/model/workflow/workflowDTO";

export class WorkflowService extends AbstractService<WorkflowDto, WorkflowCriteria>{
 

    constructor() {
        super(WORKFLOW_URL, 'workflow/');
    }

    static getWorkflowById(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/${workflowId}`);
    }

     static getWorkflowByInitiatuerId(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/initiataur/${workflowId}`);
    }

     static getAllWorkflows(): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/`);

    }
    static createWorkflow(workflow: WorkflowDto): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflow/`, workflow);
    }
    static annulerWorkflow(workflowId: number): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}workflow/annuler/${workflowId}`);
    }

    static reOpen(workflow: WorkflowDTO): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}workflow/reopen/${workflow.id}`);
    }

    static close(workflow: WorkflowDTO): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}workflow/close/${workflow.id}`);
    }

};
