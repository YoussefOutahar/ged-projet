import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { CourrielBureauOrdre } from "./CourrielBureauOrdre";
import { IntervenantCourriel } from "./IntervenantCourriel";

export class CourrielHistory {
    id: number;
    message: string;
    type: string;
    dateAction: Date;

    initiator: UtilisateurDto;
    courriel?: CourrielBureauOrdre;
    intervenant: IntervenantCourriel;

    constructor() {
        this.id = 0;
        this.message = '';
        this.type = '';
        this.dateAction = new Date();

        this.initiator = new UtilisateurDto();
        this.courriel = new CourrielBureauOrdre();
        this.intervenant = new IntervenantCourriel();
    }
}