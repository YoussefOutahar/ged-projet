import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";
interface DocumentDTOSummary {
    reference: string;
    description: string;
    dateDocument: string;
    documentCategorieCode: string;
    documentStateCode: string;
    userName: string;
    entiteAdministrativeCode: string;
    planClassementCode: string;
    ligne: number | null;
    colonne:number | null;
    numBoite:number | null;
}
export class ParapheurCriteria extends BaseCriteria { 
        public title: string;
        public documents: Array<DocumentDTOSummary>; 
        public deleted: boolean;
        public parapheurEtat: string;
    
        constructor() {
            super();
            this.title = '';      
            this.documents=new Array<DocumentDTOSummary>;
            this.deleted=false;
            this.parapheurEtat='';
        }
 }