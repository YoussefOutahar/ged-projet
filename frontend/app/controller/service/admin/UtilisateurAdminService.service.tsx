const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { UtilisateurCriteria } from 'app/controller/criteria/UtilisateurCriteria.model';
import { AxiosResponse } from "axios";
import axios from 'app/axiosInterceptor';

export class UtilisateurAdminService extends AbstractService<UtilisateurDto, UtilisateurCriteria>{

    constructor() {
        super(ADMIN_URL, 'utilisateur/');
    }

    getDashboardKPI(): Promise<AxiosResponse<any>> {
        return axios.get(`${ADMIN_URL}dashboard/utilisateur`);
    }

};