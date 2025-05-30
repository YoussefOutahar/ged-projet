import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { EntiteAdministrativeTypeCriteria } from './EntiteAdministrativeTypeCriteria.model';
import { UtilisateurCriteria } from './UtilisateurCriteria.model';

export class EntiteAdministrativeCriteria extends BaseCriteria {

  public codeLike: string;
  public referenceGedLike: string;
  public descriptionLike: string;
  public libelleLike: string;
  public entiteAdministrativeParent!: EntiteAdministrativeCriteria;
  public entiteAdministrativeParents: Array<EntiteAdministrativeCriteria>;
  public chef!: UtilisateurCriteria;
  public chefs: Array<UtilisateurCriteria>;
  public entiteAdministrativeType!: EntiteAdministrativeTypeCriteria;
  public entiteAdministrativeTypes: Array<EntiteAdministrativeTypeCriteria>;

  constructor() {
    super();
    this.codeLike = '';
    this.referenceGedLike = '';
    this.descriptionLike = '';
    this.libelleLike = '';
    this.entiteAdministrativeParent;
    this.entiteAdministrativeParents = new Array<EntiteAdministrativeCriteria>();
    this.chef;
    this.chefs = new Array<UtilisateurCriteria>();
    this.entiteAdministrativeType;
    this.entiteAdministrativeTypes = new Array<EntiteAdministrativeTypeCriteria>();
  }

}
