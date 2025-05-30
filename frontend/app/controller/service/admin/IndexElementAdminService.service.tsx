const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { IndexElementCriteria } from 'app/controller/criteria/IndexElementCriteria.model';
import { IndexElementDto } from 'app/controller/model/IndexElement.model';

export class IndexElementAdminService extends AbstractService<IndexElementDto, IndexElementCriteria>{


    constructor() {
        super(ADMIN_URL, 'indexElement/');
    }

};