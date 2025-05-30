import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { GroupeUtilisateurCriteria } from './GroupeUtilisateurCriteria.model';
import { UtilisateurCriteria } from './UtilisateurCriteria.model';

export class GroupeCriteria extends BaseCriteria {

    public codeLike: string;
    public libelleLike: string;
    public utilisateur: UtilisateurCriteria;
    public utilisateurs: Array<UtilisateurCriteria>;
    public groupeUtilisateurs!: Array<GroupeUtilisateurCriteria>;

    constructor() {
        super();
        this.codeLike = '';
        this.libelleLike = '';
        this.utilisateur = new UtilisateurCriteria();
        this.utilisateurs = new Array<UtilisateurCriteria>();
    }

}
