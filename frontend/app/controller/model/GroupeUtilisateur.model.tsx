import {BaseDto} from 'app/zynerator/dto/BaseDto.model';

import {RoleUtilisateurDto} from 'app/controller/model/RoleUtilisateur.model';
import {GroupeDto} from 'app/controller/model/Groupe.model';
import {EtatUtilisateurDto} from 'app/controller/model/EtatUtilisateur.model';
import {UtilisateurDto} from 'app/controller/model/Utilisateur.model';

export class GroupeUtilisateurDto extends BaseDto {

    public dateAjout: Date;
    public groupe: GroupeDto ;
    public utilisateur: UtilisateurDto ;
    public etatUtilisateur: EtatUtilisateurDto ;
    public roleUtilisateur: RoleUtilisateurDto ;


    constructor() {
        super();
        this.dateAjout = new Date();
        this.groupe = new GroupeDto() ;
        this.utilisateur = new UtilisateurDto() ;
        this.etatUtilisateur = new EtatUtilisateurDto() ;
        this.roleUtilisateur = new RoleUtilisateurDto() ;
        }

}
