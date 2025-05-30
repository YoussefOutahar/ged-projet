import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { EntiteAdministrativeTypeDto } from 'app/controller/model/EntiteAdministrativeType.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';

export class EntiteAdministrativeDto extends BaseDto {

    public code: string;
    public archiveLawDuration: number | null;

    public referenceGed: string;
    public description: string;
    public libelle: string;
    public chef!: UtilisateurDto;
    public entiteAdministrativeType!: EntiteAdministrativeTypeDto;
    public entiteAdministrativeParent!: EntiteAdministrativeDto;
    public utilisateurs: Array<UtilisateurDto>;


    constructor() {
        super();
        this.code = '';
        this.referenceGed = '';
        this.description = '';
        this.libelle = '';
        this.chef;
        this.entiteAdministrativeParent;
        this.entiteAdministrativeType;
        this.utilisateurs = new Array<UtilisateurDto>();
        this.archiveLawDuration = null;
    }

}
