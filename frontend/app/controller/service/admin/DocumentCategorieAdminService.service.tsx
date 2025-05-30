const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;


import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentCategorieCriteria } from 'app/controller/criteria/DocumentCategorieCriteria.model';
import axiosInstance from "app/axiosInterceptor";

export class DocumentCategorieAdminService extends AbstractService<DocumentCategorieDto, DocumentCategorieCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentCategorie/');
    }

    getDocumentCategorieBylibelle(libelle: string): Promise<any> {
        return axiosInstance.get(`${ADMIN_URL}documentCategorie/libelle/${libelle}`);
    }

};