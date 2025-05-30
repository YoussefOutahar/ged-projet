import { BaseDto } from 'app/zynerator/dto/BaseDto.model';

import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { GenderDto } from 'app/controller/model/Gender.model';
import { RoleDto } from "app/zynerator/dto/RoleDto.model";

export class UtilisateurDto extends BaseDto {

    public email: string;
    public telephone: string;
    public nom: string;
    public prenom: string;
    public dateNaissance: Date;
    public credentialsNonExpired: boolean;
    public enabled: boolean;
    public accountNonExpired: boolean;
    public accountNonLocked: boolean;
    public passwordChanged: boolean;
    public username: string;
    public password: string;
    public gender: GenderDto;
    public entiteAdministrative: EntiteAdministrativeDto;
    public roles!: RoleDto[];

    constructor() {
        super();
        this.email = '';
        this.telephone = '';
        this.nom = '';
        this.prenom = '';
        this.dateNaissance = new Date();
        this.credentialsNonExpired = false;
        this.enabled = false;
        this.accountNonExpired = false;
        this.accountNonLocked = false;
        this.passwordChanged = false;
        this.username = '';
        this.password = '';
        this.gender = new GenderDto();
        this.entiteAdministrative = new EntiteAdministrativeDto();
        this.roles = [];
    }

}
