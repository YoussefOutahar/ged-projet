const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { EntiteAdministrativeTypeDto } from 'app/controller/model/EntiteAdministrativeType.model';
import { EntiteAdministrativeTypeCriteria } from 'app/controller/criteria/EntiteAdministrativeTypeCriteria.model';

export class EntiteAdministrativeTypeAdminService extends AbstractService<EntiteAdministrativeTypeDto, EntiteAdministrativeTypeCriteria>{

    constructor() {
        super(ADMIN_URL, 'entiteAdministrativeType/');
    }

};