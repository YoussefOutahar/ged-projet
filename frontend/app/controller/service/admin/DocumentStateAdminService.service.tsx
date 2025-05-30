const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentStateDto } from 'app/controller/model/DocumentState.model';
import { DocumentStateCriteria } from 'app/controller/criteria/DocumentStateCriteria.model';
import axiosInstance from "app/axiosInterceptor";

export class DocumentStateAdminService extends AbstractService<DocumentStateDto, DocumentStateCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentState/');
    }

    getDocumentStateByID(Id: number): Promise<any> {
        return axiosInstance.get(`${ADMIN_URL}documentState/id/${Id}`);
    }

};