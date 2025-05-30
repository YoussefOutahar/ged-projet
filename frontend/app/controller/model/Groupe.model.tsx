import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { GroupeUtilisateurDto } from 'app/controller/model/GroupeUtilisateur.model';
import { UtilisateurDto } from 'app/controller/model/Utilisateur.model';
export class GroupeDto extends BaseDto {
    public code: string;
    public libelle: string;
    public utilisateur: UtilisateurDto;
    public groupeUtilisateurs: Array<GroupeUtilisateurDto>;

    constructor() {
        super();
        this.code = '';
        this.libelle = '';
        this.utilisateur = new UtilisateurDto();
        this.groupeUtilisateurs = new Array<GroupeUtilisateurDto>();
    }

}
