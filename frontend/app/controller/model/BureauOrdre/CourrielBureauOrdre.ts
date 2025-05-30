import { EtablissementBureauOrdre } from 'app/controller/model/BureauOrdre/EtablissementBureauOrdre';
import { DocumentDto } from 'app/controller/model/Document.model';
import { EntiteAdministrativeDto } from 'app/controller/model/EntiteAdministrative.model';
import { PlanClassementBO } from 'app/controller/model/BureauOrdre/PlanClassementBo';
import { IntervenantCourriel } from 'app/controller/model/BureauOrdre/IntervenantCourriel';

export class CourrielBureauOrdre {
  id: number | null;
  sujet: string;
  dateReception: string;
  dateEcheance: string;
  numeroCourriel: string;
  numeroRegistre: string;
  numeroCourrielExterne: string;
  deleted: boolean = false;
  
  voieEnvoi: VoieEnvoi;
  priorite: string;
  etatAvancement: EtatAvancementCourriel;
  confidentialite: Confidentialite;

  planClassement: PlanClassementBO;;

  entiteExterne: EtablissementBureauOrdre;
  entiteInterne: EntiteAdministrativeDto;
  documents: DocumentDto[] = [];
  intervenants: IntervenantCourriel[] = [];
  
  type: TypeCourriel | null;
  reponse: CourrielBureauOrdre | null;
  complement: CourrielBureauOrdre | null;
  pereId: number | null;

  elements?: { [key: string]: string };
  
  constructor() {
    this.id = null;
    this.sujet = '';
    this.numeroCourrielExterne = '';
    this.dateReception = '';
    this.dateEcheance = '';
    this.voieEnvoi = VoieEnvoi.AUTRE;
    this.numeroCourriel = "";
    this.numeroRegistre = "";
    this.deleted = false;
  
    this.priorite = '';
    this.etatAvancement = EtatAvancementCourriel.EN_ATTENTE;
    this.confidentialite = Confidentialite.NORMAL;

    this.planClassement = new PlanClassementBO();
    
    this.entiteExterne = new EtablissementBureauOrdre();
    this.entiteInterne = new EntiteAdministrativeDto();
    this.type = null;
    this.reponse = null;
    this.complement = null;
    this.pereId = null;
  }
}

export enum TypeCourriel {
  ENTRANT = 'ENTRANT',
  SORTANT = 'SORTANT'
}

export enum VoieEnvoi{
  POSTE = 'POSTE',
  COURRIER = 'COURRIER',
  MAIN_PROPRE = 'MAIN_PROPRE',
  FAX = 'FAX',
  EMAIL = 'EMAIL',
  AUTRE = 'AUTRE'
}

export const VoieEnvoiOptions = [
  {label: 'Poste', value: VoieEnvoi.POSTE},
  {label: 'Courrier', value: VoieEnvoi.COURRIER},
  {label: 'Main propre', value: VoieEnvoi.MAIN_PROPRE},
  {label: 'Fax', value: VoieEnvoi.FAX},
  {label: 'Email', value: VoieEnvoi.EMAIL},
  {label: 'Autre', value: VoieEnvoi.AUTRE}
]

export enum EtatAvancementCourriel {
  EN_ATTENTE = 'EN_ATTENTE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  REJETE = 'REJETE'
}

export const EtatAvancementCourrielOptions = [
  {label: 'En attente', value: EtatAvancementCourriel.EN_ATTENTE},
  {label: 'En cours', value: EtatAvancementCourriel.EN_COURS},
  {label: 'Termine', value: EtatAvancementCourriel.TERMINE},
  {label: 'Rejete', value: EtatAvancementCourriel.REJETE}
]

export enum PrioriteCourriel {
  BASSE = 'BASSE',
  MOYENNE = 'MOYENNE',
  HAUTE = 'HAUTE'
}

export const PrioriteCourrielOptions = [
  {label: 'Basse', value: PrioriteCourriel.BASSE},
  {label: 'Moyenne', value: PrioriteCourriel.MOYENNE},
  {label: 'Haute', value: PrioriteCourriel.HAUTE}
]

export enum Confidentialite {
  NORMAL = 'NORMAL',
  CONFIDENTIEL = 'CONFIDENTIEL',
  TOP_CONFIDENTIEL = 'TOP_CONFIDENTIEL'
}

export const ConfidentialiteOptions = [
  {label: 'Normal', value: Confidentialite.NORMAL, color: 'secondary'},
  {label: 'Confidentiel', value: Confidentialite.CONFIDENTIEL, color: 'warning'},
  {label: 'Top confidentiel', value: Confidentialite.TOP_CONFIDENTIEL, color: 'danger'}
]

// export enum Annotation {
//     URGENT = 'URGENT',
//     AVIS = 'AVIS',
//     REPONSE_REQUISE = 'REPONSE_REQUISE',
//     CONFIDENTIEL = 'CONFIDENTIEL',
//     INFORMATION = 'INFORMATION',
//     SUIVI = 'SUIVI',
//     A_LIRE_PLUS_TARD = 'A_LIRE_PLUS_TARD',
//     ACTION_REQUISE = 'ACTION_REQUISE',
//     NORMAL = 'NORMAL'
// };

// export const annotationOptions = [
//   {label: 'Urgent', value: Annotation.URGENT},
//   {label: 'Avis', value: Annotation.AVIS},
//   {label: 'Reponse requise', value: Annotation.REPONSE_REQUISE},
//   {label: 'Confidentiel', value: Annotation.CONFIDENTIEL},
//   {label: 'Information', value: Annotation.INFORMATION},
//   {label: 'Suivi', value: Annotation.SUIVI},
//   {label: 'A lire plus tard', value: Annotation.A_LIRE_PLUS_TARD},
//   {label: 'Action requise', value: Annotation.ACTION_REQUISE},
//   {label: 'Normal', value: Annotation.NORMAL}
// ]
