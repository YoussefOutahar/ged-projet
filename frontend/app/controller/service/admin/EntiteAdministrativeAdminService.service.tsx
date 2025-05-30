const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL as string;
import AbstractService from "app/zynerator/service/AbstractService";

import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { EntiteAdministrativeCriteria } from 'app/controller/criteria/EntiteAdministrativeCriteria.model';
import { AxiosResponse } from "axios";

import axios from 'app/axiosInterceptor';

export class EntiteAdministrativeAdminService extends AbstractService<EntiteAdministrativeDto, EntiteAdministrativeCriteria>{

    constructor() {
        super(ADMIN_URL, 'entiteAdministrative/');
    }

    getDashboardKPI(): Promise<AxiosResponse<any>> {
        return axios.get(`${ADMIN_URL}dashboard/entite-administrative`);
    }

    getOrganigrame(): Promise<AxiosResponse<any>> {
        return axios.get(`${ADMIN_URL}entiteAdministrative/organigram`);
    }
};