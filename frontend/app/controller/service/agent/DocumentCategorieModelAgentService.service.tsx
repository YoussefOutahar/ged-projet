const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';
import { DocumentCategorieModelCriteria } from 'app/controller/criteria/DocumentCategorieModelCriteria.model';

export class DocumentCategorieModelAgentService extends AbstractService<DocumentCategorieModelDto, DocumentCategorieModelCriteria>{

    constructor() {
        super(AGENT_URL, 'documentCategorieModel/');
    }

};