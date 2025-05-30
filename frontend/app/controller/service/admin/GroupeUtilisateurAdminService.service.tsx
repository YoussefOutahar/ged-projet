const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { GroupeUtilisateurDto } from 'app/controller/model/GroupeUtilisateur.model';
import { GroupeUtilisateurCriteria } from 'app/controller/criteria/GroupeUtilisateurCriteria.model';

export class GroupeUtilisateurAdminService extends AbstractService<GroupeUtilisateurDto, GroupeUtilisateurCriteria>{

    constructor() {
        super(ADMIN_URL, 'groupeUtilisateur/');
    }

};