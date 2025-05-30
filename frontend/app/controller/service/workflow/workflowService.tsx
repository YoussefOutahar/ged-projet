import { WorkflowCriteria } from "app/controller/criteria/workflow/workflowCriteria.model"
import { Workflow } from "app/controller/model/workflow/workflow"
import AbstractService from "app/zynerator/service/AbstractService"

import axiosConf from 'app/axiosInterceptor';
import { WorkflowPreset } from "app/controller/model/workflow/workflowPreset";
import { WorkflowDTO } from "app/controller/model/workflow/workflowDTO";
import { DocumentDto } from "app/controller/model/Document.model";
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { AxiosResponse } from "axios";

const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class workflowService  extends AbstractService<Workflow, WorkflowCriteria>{
   

    constructor() {
        super(WORKFLOW_URL, 'workflow/');
    }

    static getWorkflowById(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/${workflowId}`);
    }

    static getWorkflowByInitiatuerIdByStatus(workflowId: number ,status :Workflow.StatusEnum ): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/initiataur/${workflowId}`, {params: {status: status}});
    }

    static getWorkflowByInitiatuerIdByStatusPaginate(workflowId: number, status: Workflow.StatusEnum, pageNumber: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/initiataur/paganieted/visible/${workflowId}`,
            {
                params: {
                    status: status,
                    page: pageNumber,
                    size: 7
                }
            });
    }

     static getAllWorkflows() {
        return axiosConf.get<WorkflowDTO[]>(`${WORKFLOW_URL}workflow/`);

    }
    static createWorkflow(workflow: WorkflowDTO): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflow/`, workflow);
    }

    static annulerWorkflow(workflowId: number): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}workflow/annuler/${workflowId}`);
    }

    static associateWorkflowToParapheur(workflow: number, parapheur: number, currentStepId: number): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflow/${workflow}/parapheur/${parapheur}/currentStep/${currentStepId}`);
    }
    static addDocumentToStep(workflowId: number): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflow/step/${workflowId}`);
    }

    static getDocumentActions(workflowId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/documentActions/${workflowId}`);
    }

    static getWorkflowByParapheurId(parapheurId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/byParapheur/${parapheurId}`);
    }

    static addPVToWorkflow(workflowId: number, documents: DocumentDto[]): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}workflow/${workflowId}/addPV`, documents);
    }

    static getParpheursByWorkflowId(workflowId: number): Promise<AxiosResponse<ParapheurDto[]>> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/parapheurs/${workflowId}`);
    }

    static getSignedCEByWorkflowId(workflowId: number): Promise<AxiosResponse<DocumentDto[]>> {
        return axiosConf.get(`${WORKFLOW_URL}workflow/signedCE/${workflowId}`);
    }

}