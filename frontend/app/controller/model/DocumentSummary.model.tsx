import { BaseDto } from 'app/zynerator/dto/BaseDto.model';
import { DocumentIndexElementSummaryDto } from './DocumentIndexElementSummary.model';

export class DocumentSummaryDto extends BaseDto {

    public reference : string;
    public description : string;
    public content : string;
    public ligne:null | number;
    public size : null | number;
    public colonne:null | number;
    public numBoite:null | number;
    public uploadDate: string;
    public documentStateId: null | number;
    public documentTypeId: null | number;
    public documentStateCode : string;
    public documentTypeCode : string;
    public documentCategorieId : null | number;
    public documentCategorieCode : string;
    public utilisateurId : null | number;
    public entiteAdministrativeId : null | number ;
    public utilisateurEmail : string;
    public entiteAdministrativeCode : string;
    public isSigned : boolean;
    public planClassementId : null | number;
    public planClassementCode : string;
    public documentCategorieModelCode : string;
    public creationDate: string;
    public lastUpdate: string;
    public fileUrl: string;
    public documentIndexElements: Array<DocumentIndexElementSummaryDto>;

    constructor() {
        super();
        this.reference = '';
        this.uploadDate = '';
        this.content = '';
        this.ligne = null;
        this.colonne = null;
        this.numBoite = null;
        this.size = null;
        this.description = '';
        this.documentStateId = null;
        this.documentTypeId = null;
        this.documentTypeCode = '';
        this.documentStateCode = '';
        this.documentCategorieId = null;
        this.documentCategorieCode = '';
        this.utilisateurId = null;
        this.entiteAdministrativeId = null;
        this.utilisateurEmail = '';
        this.entiteAdministrativeCode = '';
        this.isSigned = false;
        this.planClassementId = null;
        this.planClassementCode = '';
        this.documentCategorieModelCode = '';
        this.creationDate = '';
        this.lastUpdate = '';
        this.fileUrl = '';
        this.documentIndexElements = new Array<DocumentIndexElementSummaryDto>();
    }

}
