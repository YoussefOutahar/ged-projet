import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { DocumentStateDto } from 'app/controller/model/DocumentState.model';
import { DocumentPartageGroupeDto } from 'app/controller/model/DocumentPartageGroupe.model';
import { DocumentTagDto } from 'app/controller/model/DocumentTag.model';
import { DocumentCategorieDto } from 'app/controller/model/DocumentCategorie.model';
import { DocumentIndexElementDto } from 'app/controller/model/DocumentIndexElement.model';
import { DocumentPartageUtilisateurDto } from 'app/controller/model/DocumentPartageUtilisateur.model';
import { DocumentCategorieModelDto } from 'app/controller/model/DocumentCategorieModel.model';
import { DocumentTypeDto } from 'app/controller/model/DocumentType.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
import { PlanClassementDto } from './PlanClassement.model';
import { EchantillonDto } from './DocumentEchantillon.model';
import { array } from 'yup';

export class DocumentDto extends BaseDto {

    public  reference : string;
    public  referenceGed :string;
    public  elasticId:string;
    public  uploadDate:Date;
    public  annee :null | number;
    public  semstre :null | number;
    public  mois :null | number;
    public  jour :null | number;
    public  ligne:null | number;
    public  colonne:null | number;
    public  numBoite:null | number;
    public  ocr : Boolean;
    public  signed : Boolean;
    public paraphed: Boolean;
    public  content : string;
    public  size : null | number;
    public  description :string;
    public  archive :Boolean
    public  versionne :Boolean
    public  qualityFlag:Boolean
    public  qualityStatus:Boolean
    public  locked:Boolean
    public courrielRelated: boolean;
    public documentType: DocumentTypeDto;
    public documentState: DocumentStateDto;
    public documentCategorie: DocumentCategorieDto;
    public utilisateur: UtilisateurDto;
    public entiteAdministrative: EntiteAdministrativeDto;
    public planClassement: PlanClassementDto;
    public documentCategorieModel: DocumentCategorieModelDto;
    public documentIndexElements: Array<DocumentIndexElementDto>;
    public documentPartageGroupes: Array<DocumentPartageGroupeDto>;
    public documentPartageUtilisateurs: Array<DocumentPartageUtilisateurDto>;
    public documentTags: Array<DocumentTagDto>;
    public echantillons :Array<any>;
    public archivable: boolean;
    public documentSignatureCode?: string


    constructor() {
        super();
        this.qualityFlag=false;
        this.qualityStatus=false;
        this.elasticId='';
        this.reference = '';
        this.referenceGed = '';
        this.uploadDate = new Date();
        this.annee = null;
        this.semstre = null;
        this.mois = null;
        this.jour = null;
        this.ligne = null;
        this.colonne = null;
        this.numBoite = null;
        this.ocr = false;
        this.signed = false;
        this.paraphed = false;
        this.content = '';
        this.size = null;
        this.description = '';
        this.archive = false;
        this.locked = false;
        this.versionne = false;
        this.courrielRelated = false;
        this.documentType = new DocumentTypeDto();
        this.documentState = new DocumentStateDto();
        this.documentCategorie = new DocumentCategorieDto();
        this.utilisateur = new UtilisateurDto();
        this.entiteAdministrative = new EntiteAdministrativeDto();
        this.planClassement = new PlanClassementDto();
        this.documentCategorieModel = new DocumentCategorieModelDto();
        this.documentIndexElements = new Array<DocumentIndexElementDto>();
        this.documentPartageGroupes = new Array<DocumentPartageGroupeDto>();
        this.documentPartageUtilisateurs = new Array<DocumentPartageUtilisateurDto>();
        this.documentTags = new Array<DocumentTagDto>();
        this.echantillons= new Array<any>();
        this.archivable = false;
        this.documentSignatureCode = '';
    }

}
