const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import { PlanClassementIndexCriteria } from "app/controller/criteria/PlanClassementIndexCriteria.model";
import { PlanClassementIndexDto } from "app/controller/model/PlanClassementIndex.model";
import AbstractService from "app/zynerator/service/AbstractService";

export class PlanClassementIndexAdminService extends AbstractService<PlanClassementIndexDto, PlanClassementIndexCriteria> {
    constructor() {
        super(ADMIN_URL, 'planClassementIndex/');
    }
}