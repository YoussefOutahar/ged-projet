import AbstractService from "app/zynerator/service/AbstractService";

import { AccessShareDto } from 'app/controller/model/AccessShare.model';
import { AccessShareCriteria } from 'app/controller/criteria/AccessShareCriteria.model';

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

export class AccessShareAdminService extends AbstractService<AccessShareDto, AccessShareCriteria>{

    constructor() {
        super(ADMIN_URL, 'accessShare/');
    }
};