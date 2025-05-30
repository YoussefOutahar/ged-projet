import { BaseCriteria } from 'app/zynerator/criteria/BaseCriteria.model';

import { DocumentStateCriteria } from './DocumentStateCriteria.model';
import { DocumentPartageGroupeCriteria } from './DocumentPartageGroupeCriteria.model';
import { DocumentTagCriteria } from './DocumentTagCriteria.model';
import { DocumentCategorieCriteria } from './DocumentCategorieCriteria.model';
import { DocumentIndexElementCriteria } from './DocumentIndexElementCriteria.model';
import { DocumentPartageUtilisateurCriteria } from './DocumentPartageUtilisateurCriteria.model';
import { DocumentCategorieModelCriteria } from './DocumentCategorieModelCriteria.model';
import { DocumentTypeCriteria } from './DocumentTypeCriteria.model';
import { EntiteAdministrativeCriteria } from './EntiteAdministrativeCriteria.model';
import { UtilisateurCriteria } from './UtilisateurCriteria.model';

export class ArchiveCriteria extends BaseCriteria {


    public reference: string;
    public referenceGed: string;
    public uploadDate: Date;
    public snapshot: string;



    constructor() {
        super();
        this.reference = '';
        this.referenceGed = '';
        this.uploadDate = new Date();
        this.snapshot = '';
      
    }
}
