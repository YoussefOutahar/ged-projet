const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentPartageGroupeDto } from 'app/controller/model/DocumentPartageGroupe.model';
import { DocumentPartageGroupeCriteria } from 'app/controller/criteria/DocumentPartageGroupeCriteria.model';

export class DocumentPartageGroupeAdminService extends AbstractService<DocumentPartageGroupeDto, DocumentPartageGroupeCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentPartageGroupe/');
    }

};