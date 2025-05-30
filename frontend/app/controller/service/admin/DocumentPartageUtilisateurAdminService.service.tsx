const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentPartageUtilisateurDto } from 'app/controller/model/DocumentPartageUtilisateur.model';
import { DocumentPartageUtilisateurCriteria } from 'app/controller/criteria/DocumentPartageUtilisateurCriteria.model';

export class DocumentPartageUtilisateurAdminService extends AbstractService<DocumentPartageUtilisateurDto, DocumentPartageUtilisateurCriteria>{

    constructor() {
        super(ADMIN_URL, 'documentPartageUtilisateur/');
    }

};