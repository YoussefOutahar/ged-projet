import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { BaseCriteria } from "app/zynerator/criteria/BaseCriteria.model";


export interface UserDTOCriteria extends BaseCriteria {
    utilisateurLike?: UtilisateurDto;
    stepIdLike?: number;
    poidsLike?: number;
    
}
