import { PlanClassementModelIndexCriteria } from "app/controller/criteria/PlanClassementModelIndexCriteria.model";
import { PlanClassementModelIndexDto } from "app/controller/model/PlanClassementModelIndex.model";
import AbstractService from "app/zynerator/service/AbstractService";

const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL  as string;

export class PlanClassementModelIndexAdminService extends AbstractService<PlanClassementModelIndexDto, PlanClassementModelIndexCriteria>{
    constructor() {
        super(ADMIN_URL, 'planClassementModelIndex/');
    }
}