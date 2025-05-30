import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { AccessShareCriteria } from './AccessShareCriteria.model';
import { DocumentCriteria } from './DocumentCriteria.model';
import { UtilisateurCriteria } from './UtilisateurCriteria.model';




export class DocumentPartageUtilisateurCriteria extends BaseCriteria {


  public dateShare: Date | null;
  public dateShareFrom: Date | null;
  public dateShareTo: Date | null;
  public description: string;
  public descriptionLike: string;
  public document: DocumentCriteria;
  public documents: Array<DocumentCriteria>;
  public utilisateur: UtilisateurCriteria;
  public utilisateurs: Array<UtilisateurCriteria>;
  public accessShare: AccessShareCriteria;
  public accessShares: Array<AccessShareCriteria>;

  constructor() {
    super();
    this.dateShare = null;
    this.dateShareFrom = null;
    this.dateShareTo = null;
    this.description = '';
    this.descriptionLike = '';
    this.document = new DocumentCriteria();
    this.documents = new Array<DocumentCriteria>();
    this.utilisateur = new UtilisateurCriteria();
    this.utilisateurs = new Array<UtilisateurCriteria>();
    this.accessShare = new AccessShareCriteria();
    this.accessShares = new Array<AccessShareCriteria>();
  }

}
