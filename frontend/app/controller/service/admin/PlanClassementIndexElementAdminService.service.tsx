const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

import { PlanClassementIndexElementCriteria } from "app/controller/criteria/PlanClassementIndexElementCriteria.model";
import { PlanClassementIndexElementDto } from "app/controller/model/PlanClassementIndexElement.model";
import AbstractService from "app/zynerator/service/AbstractService";

export class PlanClassementIndexElementAdminService extends AbstractService<PlanClassementIndexElementDto,PlanClassementIndexElementCriteria> {
    constructor() {
        super(ADMIN_URL,'planClassementIndexElement/');
    }
}