
import axiosConf from 'app/axiosInterceptor';
import { Workflow } from 'app/controller/model/workflow/workflow';
import { WorkflowDTO } from 'app/controller/model/workflow/workflowDTO';


const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class WorkflowKPIService {
    
    constructor() {
       
    }

 
    countWorkflows(): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/count`);
    }

    countWorkflowsByUser(initiateurId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/countByUser`,{ params:{initiateurId}});
    }

    countWorkflowsByStatus(status : Workflow.StatusEnum): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/status`,{ params:{status}});
    }

    countWorkflowsByStatusByInitiateurId(status : Workflow.StatusEnum, initiateurId : number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/status/initiateurId`,{ params:{status,initiateurId}});
    }

    countWorkflowsByFlag(flag :WorkflowDTO.FlagEnum): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/flag`,{ params:{flag}});
    }

    countWorkflowsByFlagAndInitiateur(id: number,flag :Workflow.FlagEnum): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/flag/user`,{ params:{id,flag}});
    }

    workflowDuration(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/workflowDuration/${id}`);
    }

    top3Lentes(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/top3/lente/${id}`);
    }

    top3Rapides(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/top3/rapide/${id}`);
    }

    getWorkflowKPIDto(): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi`);
    }    

    getWorflowKPIDtoByWorkflowTitle(title: string): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}kpi/${title}`);
    }

}