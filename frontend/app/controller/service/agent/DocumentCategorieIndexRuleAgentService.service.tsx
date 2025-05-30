const AGENT_URL = process.env.NEXT_PUBLIC_AGENT_URL  as string;

import AbstractService from "app/zynerator/service/AbstractService";

import { DocumentCategorieIndexRuleDto } from 'app/controller/model/DocumentCategorieIndexRule.model';
import { DocumentCategorieIndexRuleCriteria } from 'app/controller/criteria/DocumentCategorieIndexRuleCriteria.model';

export class DocumentCategorieIndexRuleAgentService extends AbstractService<DocumentCategorieIndexRuleDto, DocumentCategorieIndexRuleCriteria>{

    constructor() {
        super(AGENT_URL, 'documentCategorieIndexRule/');
    }

};