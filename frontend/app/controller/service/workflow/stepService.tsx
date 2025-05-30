import { StepCriterial } from "app/controller/criteria/workflow/StepCriterial";
import { StepDTO } from "app/controller/model/workflow/stepDTO";
import AbstractService from "app/zynerator/service/AbstractService";
import axiosConf from 'app/axiosInterceptor';
import { CommentaireDTO } from "app/controller/model/workflow/commentaireDTO";
import axios from "axios";
import { DocumentDto } from "app/controller/model/Document.model";


const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class stepService extends AbstractService<StepDTO, StepCriterial>{
    
    constructor() {
        super(WORKFLOW_URL, 'step/');
    }

    static stepsByDestinataireIdAndStatus(id: number, status :any, page: number, size: number = 5, search : string = ""){
        let url = `${WORKFLOW_URL}step/Destinataire/${id}`;
        if (status) {
            url += `?status=${status}`;
        }
        return axios.get<Page<StepDTO>>(url,{
            params: {
                page: page,
                size: size,
                search: search
            }
        });
    }
    static updateStepDocument(step : StepDTO): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/updateDocument`,step);
    }

    static getPriviousStep(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}step/previous/${id}`);
    }

    static getNextStep(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}step/next/${id}`);
    }


    static approveStep(StepID: number,useId : number): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/approve/${StepID}/${useId}`);
    }

    static signStep(StepID: number,useId : number ): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/sign/${StepID}/${useId}`);
    }

    static parapherStep(StepID: number,useId : number ): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/parapher/${StepID}/${useId}`);
    }

    static presignerStep(StepID: number,useId : number ): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/presigner/${StepID}/${useId}`);
    }

    static rejectStep(StepID: number): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/reject/${StepID}`);
    }

    static complimentStep(StepID: number, specificStepId?: number): Promise<any> {
        let url = `${WORKFLOW_URL}step/Compliment/${StepID}`;
        if (specificStepId) {
            url += `?specificStepId=${specificStepId}`;
        }
        return axiosConf.put(url);
    }

    static addCommentaireToStep(StepID: number, commentaire : CommentaireDTO): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/Commentaire/${StepID}`,commentaire);
    }

    static actionDocument(StepID: number, document : DocumentDto[]): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/actionDoc/${StepID}`,document);
    }

    static preSignDocs(StepID: number, document : DocumentDto[]): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/preSignDocs/${StepID}`,document);
    }

    static envoiCourrierDone(StepID: number): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/envoiCourrierDone/${StepID}`);
    }

    static signDocumentWF(Id: number, document : DocumentDto): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/signDocumentWF/${Id}`,document);
    }

    static getDocsTach(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}step/documentsCollab/${id}`);
    }

    static getDocumentsActionsByStep(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}step/documentActions/${id}`);
    }
    
    static getDocumentsPresign(id: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}step/documentsPresign/${id}`);
    }

    static addDocumentsToStep(stepId: number, documents: DocumentDto[]): Promise<any> {
        return axiosConf.post(`${WORKFLOW_URL}step/${stepId}/documents`,  documents);
    }

    static removeDocumentsFromStep(stepId: number, documents: DocumentDto[]): Promise<any> {
        return axiosConf.delete(`${WORKFLOW_URL}step/${stepId}/documents`,  { data: documents });
    }

    static rejectDocFromStep(stepId: number, documents: DocumentDto[]): Promise<any> {
        const documentIds = documents.map(doc => doc.id);
        return axiosConf.put(`${WORKFLOW_URL}step/rejectDoc/Step/${stepId}`, documentIds);
    }

    static rejectDocFromParapheur(stepId: number, documents: DocumentDto[], parapheurId?: number): Promise<any>{      
        const documentIds = documents && documents.map(doc => doc.id);
        const params = {
            parapheurId: parapheurId || undefined,
        };
    
        return axiosConf.post(`${WORKFLOW_URL}step/steps/${stepId}/reject-documents`, documentIds, {
            params: params,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    
    };

    static envoiCourrierAction(stepId: number, documents: DocumentDto[]): Promise<any> {
        return axiosConf.put(`${WORKFLOW_URL}step/envoiCourrier/${stepId}`, documents);
    }
}