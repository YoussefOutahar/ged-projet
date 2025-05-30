const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentTypeDto } from 'app/controller/model/DocumentType.model';
import { DocumentTypeCriteria } from 'app/controller/criteria/DocumentTypeCriteria.model';
import axiosInstance from "app/axiosInterceptor";

export class DocumentTypeAdminService extends AbstractService<DocumentTypeDto, DocumentTypeCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentType/');
    }

    getDocumentTypeByID(Id: number): Promise<any> {
        return axiosInstance.get(`${ADMIN_URL}documentType/id/${Id}`);
    }

};