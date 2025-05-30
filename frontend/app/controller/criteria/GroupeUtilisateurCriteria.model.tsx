import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { RoleUtilisateurCriteria } from './RoleUtilisateurCriteria.model';
import { GroupeCriteria } from './GroupeCriteria.model';
import { EtatUtilisateurCriteria } from './EtatUtilisateurCriteria.model';
import { UtilisateurCriteria } from './UtilisateurCriteria.model';

export class GroupeUtilisateurCriteria extends BaseCriteria {

  public dateAjout: Date | null;
  public dateAjoutFrom: Date | null;
  public dateAjoutTo: Date | null;
  public groupe: GroupeCriteria;
  public groupes: Array<GroupeCriteria>;
  public utilisateur: UtilisateurCriteria;
  public utilisateurs: Array<UtilisateurCriteria>;
  public etatUtilisateur: EtatUtilisateurCriteria;
  public etatUtilisateurs: Array<EtatUtilisateurCriteria>;
  public roleUtilisateur: RoleUtilisateurCriteria;
  public roleUtilisateurs: Array<RoleUtilisateurCriteria>;

  constructor() {
    super();
    this.dateAjout = null;
    this.dateAjoutFrom = null;
    this.dateAjoutTo = null;
    this.groupe = new GroupeCriteria();
    this.groupes = new Array<GroupeCriteria>();
    this.utilisateur = new UtilisateurCriteria();
    this.utilisateurs = new Array<UtilisateurCriteria>();
    this.etatUtilisateur = new EtatUtilisateurCriteria();
    this.etatUtilisateurs = new Array<EtatUtilisateurCriteria>();
    this.roleUtilisateur = new RoleUtilisateurCriteria();
    this.roleUtilisateurs = new Array<RoleUtilisateurCriteria>();
  }

}
