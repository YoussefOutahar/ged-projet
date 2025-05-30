import AbstractService from "app/zynerator/service/AbstractService"

import axiosConf from 'app/axiosInterceptor';
import { UserDestinataireDTO } from "app/controller/model/workflow/userDestinataireDTO";
import { UserDTOCriteria } from "app/controller/criteria/workflow/userDDTOCriteria";


const WORKFLOW_URL = process.env.NEXT_PUBLIC_WORKFLOW_URL as string

export class UserDestinataireService  extends AbstractService<UserDestinataireDTO, UserDTOCriteria>{
   

    constructor() {
        super(WORKFLOW_URL, 'user-destinataires/');
    }

     

    static getUserDestinataireListByUtilisateurId(utilisateurId: number): Promise<any> {
        return axiosConf.get(`${WORKFLOW_URL}user-destinataires/utilisateur/${utilisateurId}`);
    }

      

}