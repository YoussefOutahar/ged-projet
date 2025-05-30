import  { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosConf from 'app/axiosInterceptor';
import axios from 'axios';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL as string;

const ADMIN_MINIO_BACKEND_URL = process.env.NEXT_PUBLIC_MINIO_BACKEND_URL as string;
const NEXT_PUBLIC_DEFAULT_BUCKET = process.env.NEXT_PUBLIC_DEFAULT_BUCKET as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentDto } from 'app/controller/model/Document.model';
import { DocumentCriteria } from 'app/controller/criteria/DocumentCriteria.model';

export class DocumentAdminService extends AbstractService<DocumentDto, DocumentCriteria>{

    constructor() {
        super(ADMIN_URL, 'document/');
    }

    getDocumentShareLink(documentId: number, days: number, hours: number, minutes: number): Promise<any> {
        return axios.post(`${ADMIN_MINIO_BACKEND_URL}ged/generate-share-link?id=${documentId}&days=${days}&hours=${hours}&minutes=${minutes}&seconds=${0}`);
    }
    downloadFile(referenceGed: string, config?: AxiosRequestConfig){
        return axios.get(`${ADMIN_MINIO_BACKEND_URL}${NEXT_PUBLIC_DEFAULT_BUCKET}/file/download/${referenceGed}`,{ responseType: 'blob' , ...config});
    }
    getDocumentBase64(documentId: number): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}document/preview/${documentId}`);
    }


    getDocumenByUserName(userName: string): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}dashboard/documents-by-users?username=${userName}`);
    }

    getDocumenByEntiteAdmunistrative(entiteAdministrativeRef: string): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}dashboard/documents-by-entite-administrative?entite=${entiteAdministrativeRef}`);
    }

    getDashboardKPI(): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}dashboard/documents-by-users?username=`);
    }
    getPlanKpi(): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}plan-classement/counts`);
    }
    getGlobaleProduction(startDate: string, endDate:string): Promise<any> {       
        return axiosConf.get(`${ADMIN_URL}document/production`,{params:{startDate:startDate,endDate:endDate}});
    }
    getArchiveBase64(documentId: number): Promise<any> {
        return axiosConf.get(`${ADMIN_URL}document/viewarchive/${documentId}`);
    }
};
