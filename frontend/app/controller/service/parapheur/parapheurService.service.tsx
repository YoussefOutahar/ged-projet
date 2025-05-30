import AbstractService from "app/zynerator/service/AbstractService";
import axiosConf from 'app/axiosInterceptor';
import { ParapheurCriteria } from "app/controller/criteria/parapheur/ParapheurCriteria.mode";
import { DocumentDto } from "app/controller/model/Document.model";
import { ParapheurDto } from "app/controller/model/parapheur/parapheurDto.model";
import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { CompareRequest } from "app/controller/model/CompareRequest.model";
import { MessageService } from "app/zynerator/service/MessageService";



const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class parapheurService  extends AbstractService<ParapheurDto, ParapheurCriteria>{
   
    constructor() {
        super(NEXT_PUBLIC_API_URL, 'parapheurs/');
    }
    static getAllParapheurs() {
        return axiosConf.get<any[]>(`${NEXT_PUBLIC_API_URL}/parapheurs/`);

    }
    static createParapheur(documets: DocumentDto[], title : string, users: UtilisateurDto[]) {
        const formData = new FormData();
        formData.append ('title', title);
        formData.append('documents', JSON.stringify(documets));
        formData.append('users', JSON.stringify(users));
        return axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/`,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static getFicheParaph(parapheurId: number) {
        return axiosConf.get<DocumentDto>(`${NEXT_PUBLIC_API_URL}/parapheurs/findFicheParaph/${parapheurId}`);
    }

    static async signDocument (documentId: number, parapheurId: number, refetchParapheur?: ()=> void){
        await axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/sign/${parapheurId}/${documentId}`);
        refetchParapheur && refetchParapheur();
    }
    
    static addUsers (workflowId: number, users: UtilisateurDto[]){
        return axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/update/users/${workflowId}`,users);
    }
    static updatePrapheur(id: number,parapheur : ParapheurDto){
        return axiosConf.put(`${NEXT_PUBLIC_API_URL}/parapheurs/${id}`, parapheur);
    }
    static DeleteParapheurs(ids : number[]){
        return  axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/delete-parapheurs-list`,ids);
    }
    static DeleteParapheur(id : number){
        return  axiosConf.delete(`${NEXT_PUBLIC_API_URL}/parapheurs/${id}`)
    }
    static fetchDocumentsForParapheur (parapheurId : string){
        return  axiosConf.post<any[]>(`${NEXT_PUBLIC_API_URL}/parapheurs/findDocumentsByParapheur/${parapheurId}`);
    }
    static compare (item : CompareRequest){
        return  axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/compare`,item);
    }

    static userCanSignParapheur = async (parapheurId: number) => {
        return axiosConf.get<Boolean>(`${NEXT_PUBLIC_API_URL}/parapheurs/userCanSign/${parapheurId}`);
    }

    static  signAll = async (paraphId: number, connectedUser: UtilisateurDto | null, toastRef?: any, refetchParapheur?: ()=> void, setSigningInProgress: (state :boolean)=> void = (state: boolean)=> {}) => {
        setSigningInProgress(true);
        if (connectedUser == null || connectedUser?.id === undefined) {
            toastRef && MessageService.showError(toastRef, "Erreur", "Erreur lors de l'identifier l'utilisateur ");
            setSigningInProgress(false);
            return;
        }    
        const userCanSign = async (connectedUser : UtilisateurDto) => {
            try {
                const username = connectedUser?.username;
                const response = await axiosConf.get(`${NEXT_PUBLIC_API_URL}/certificate/has-certificate`, {
                    params: { username }
                });
        
                if (response.status === 200) {
                    const hasCertificate = response.data;
                    return hasCertificate;
                } else {
                    console.error('Failed to check certificate status');
                    return false;
                }
            } catch (error) {
                console.error('Error checking certificate status', error);
                return false;
            }
        };
    
        const hasCertificate = await userCanSign(connectedUser);
    
        if (!hasCertificate) {
            toastRef && MessageService.showError(toastRef, "Erreur", "Vous n'avez pas de certificat pour signer les documents");
            setSigningInProgress(false);
            return;
        }
        
        axiosConf.post(`${NEXT_PUBLIC_API_URL}/parapheurs/sign-all/${paraphId}`).then(() => {
            refetchParapheur && refetchParapheur();
        }).catch(() => {
            toastRef && MessageService.showError(toastRef, "Erreur", "Erreur lors de la signature des documents");
        }).finally(() => {
            setSigningInProgress(false);
        });
        
    };

    static getAllKPIParapheurs() {
        return axiosConf.get(`${NEXT_PUBLIC_API_URL}/parapheurs/kpi`);

    }


    static getAllKPIParapheurByTitle(title: string) {
        return axiosConf.get(`${NEXT_PUBLIC_API_URL}/parapheurs/kpi/${title}`);

    }
}