import { PlanClassementModelCriteria } from "app/controller/criteria/PlanClassementModelCriteria.model";
import { PlanClassementModelDto } from "app/controller/model/PlanClassementModel.model";
import AbstractService from "app/zynerator/service/AbstractService";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

export class PlanClassementModelAdminService extends AbstractService<PlanClassementModelDto, PlanClassementModelCriteria>{

    constructor() {
        super(ADMIN_URL, 'planClassementModel/');
    }

}