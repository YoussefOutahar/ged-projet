import { BaseDto } from "app/zynerator/dto/BaseDto.model";
import { UtilisateurDto } from "../Utilisateur.model";

export class ParapheurDto extends BaseDto {
    
    public title: string;
    public deleted: boolean;
    public parapheurEtat: string;
    public utilisateur: UtilisateurDto;
    public utilisateurDtos: Array<UtilisateurDto>;

    
    public createdOn: string;
    public updatedOn: string;
    public createdBy: string;
    public updatedBy: string;

    constructor() {
        super();
        this.title = '';      
        this.deleted=false;
        this.parapheurEtat='';
        this.utilisateur = new UtilisateurDto();
        this.utilisateurDtos = new Array<UtilisateurDto>();

        
        this.createdOn = '';
        this.updatedOn = '';
        this.createdBy = '';
        this.updatedBy = '';
    }
    
}
