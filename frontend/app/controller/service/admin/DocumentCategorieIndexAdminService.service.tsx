import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentCategorieIndexDto } from 'app/controller/model/DocumentCategorieIndex.model';
import { DocumentCategorieIndexCriteria } from 'app/controller/criteria/DocumentCategorieIndexCriteria.model';
import  { AxiosResponse } from "axios";
import axios from 'app/axiosInterceptor';


const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL as string;

export class DocumentCategorieIndexAdminService extends AbstractService<DocumentCategorieIndexDto, DocumentCategorieIndexCriteria> {

    findByDocumentCategorieId(id: number): Promise<AxiosResponse<DocumentCategorieIndexDto[]>> {
        return axios.get(this._url + 'documentCategorieOptimized/id/' + id);
    }

    constructor() {
        super(ADMIN_URL, 'documentCategorieIndex/');
    }

};