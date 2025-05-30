const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { EtatUtilisateurDto } from 'app/controller/model/EtatUtilisateur.model';
import { EtatUtilisateurCriteria } from 'app/controller/criteria/EtatUtilisateurCriteria.model';

export class EtatUtilisateurAdminService extends AbstractService<EtatUtilisateurDto, EtatUtilisateurCriteria>{

    constructor() {
        super(ADMIN_URL, 'etatUtilisateur/');
    }

};