const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { GroupeDto } from 'app/controller/model/Groupe.model';
import { GroupeCriteria } from 'app/controller/criteria/GroupeCriteria.model';

export class GroupeAdminService extends AbstractService<GroupeDto, GroupeCriteria>{

    constructor() {
        super(ADMIN_URL, 'groupe/');
    }

};