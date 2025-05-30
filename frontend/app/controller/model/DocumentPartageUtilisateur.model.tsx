import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { AccessShareDto } from 'app/controller/model/AccessShare.model';
import { DocumentDto } from 'app/controller/model/Document.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';

export class DocumentPartageUtilisateurDto extends BaseDto {

    public dateShare: Date;
    public description: string;
    public document: DocumentDto;
    public utilisateur: UtilisateurDto;
    public accessShare: AccessShareDto;

    constructor() {
        super();
        this.dateShare = new Date();
        this.description = '';
        this.document = new DocumentDto();
        this.utilisateur = new UtilisateurDto();
        this.accessShare = new AccessShareDto();
    }
}
