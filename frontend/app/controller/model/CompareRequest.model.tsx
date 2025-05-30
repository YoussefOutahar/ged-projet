import { DocumentDto } from "./Document.model";

export class CompareRequest {
    public stepDocuments: Array<DocumentDto>;
    public workflowId :null | number;



    constructor() {
        this.stepDocuments = new Array<DocumentDto>();
        this.workflowId = null;
    }

}
