const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { GenderDto } from 'app/controller/model/Gender.model';
import { GenderCriteria } from 'app/controller/criteria/GenderCriteria.model';

export class GenderAdminService extends AbstractService<GenderDto, GenderCriteria>{

    constructor() {
        super(ADMIN_URL, 'gender/');
    }

};