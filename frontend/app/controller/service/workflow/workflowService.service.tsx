import { WorkflowCriteria } from "app/controller/criteria/workflow/workflowCriteria.model"
import { Workflow } from "app/controller/model/workflow/workflow"
import AbstractService from "app/zynerator/service/AbstractService"

import axiosConf from 'app/axiosInterceptor';

const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class workflowService  extends AbstractService<Workflow, WorkflowCriteria>{
   

    constructor() {
        super(WORKFLOW_URL, 'workflow/');
    }

    getWorkflowById(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/${workflowId}`);
    }

     static getAllWorkflows(): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/All/`);
    }


}