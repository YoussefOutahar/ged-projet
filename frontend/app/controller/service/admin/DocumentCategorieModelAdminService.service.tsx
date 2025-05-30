const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';
import { DocumentCategorieModelCriteria } from 'app/controller/criteria/DocumentCategorieModelCriteria.model';

export class DocumentCategorieModelAdminService extends AbstractService<DocumentCategorieModelDto, DocumentCategorieModelCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentCategorieModel/');
    }

};