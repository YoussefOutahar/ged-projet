import { UtilisateurDto } from "app/controller/model/Utilisateur.model";
import { DocumentDto } from 'app/controller/model/Document.model';

export class IntervenantCourriel {
    id: number | null = null;
    done: boolean = false;
    commentaire: string = '';
    dateCreation: string = '';
    dateIntervention: string = '';
    action: string = "";  

    statut: StatutIntervention = StatutIntervention.EN_ATTENTE;

    responsables: UtilisateurDto[] = [];
    intervenant: UtilisateurDto | null = null;
    createdBy: UtilisateurDto | null = null;

    documents: DocumentDto[] = [];
}

export enum StatutIntervention {
    EN_COURS = 'EN_COURS',
    CLOTURE = 'CLOTURE',
    EN_ATTENTE = 'EN_ATTENTE',
    ANNULE  = 'ANNULE',
}

export const StatutInterventionOptions = [
    { label: 'En cours', value: StatutIntervention.EN_COURS, color: ''},
    { label: 'Cloture', value: StatutIntervention.CLOTURE , color: 'green'},
    { label: 'En attente', value: StatutIntervention.EN_ATTENTE , color: 'orange'},
    { label: 'Annule', value: StatutIntervention.ANNULE, color: 'red'}
]

// export enum ActionCourriel {
//     URGENT = 'URGENT',
//     AVIS = 'AVIS',
//     REPONSE_REQUISE = 'REPONSE_REQUISE',
//     CONFIDENTIEL= 'CONFIDENTIEL',
//     INFORMATION= 'INFORMATION',
//     SUIVI= 'SUIVI',
//     A_LIRE_PLUS_TARD = 'A_LIRE_PLUS_TARD',
//     ACTION_REQUISE = 'ACTION_REQUISE',
//     NORMAL  = 'NORMAL',
//     PAYE = 'PAYE',
//     APPROUVE = 'APPROUVE'
// }

// export const ActionCourrielOptions = [
//     { label: 'Urgent', value: ActionCourriel.URGENT },
//     { label: 'Avis', value: ActionCourriel.AVIS },
//     { label: 'Reponse Requise', value: ActionCourriel.REPONSE_REQUISE },
//     { label: 'Confidentiel', value: ActionCourriel.CONFIDENTIEL },
//     { label: 'Information', value: ActionCourriel.INFORMATION },
//     { label: 'Suivi', value: ActionCourriel.SUIVI },
//     { label: 'A lire plus tard', value: ActionCourriel.A_LIRE_PLUS_TARD },
//     { label: 'Action requise', value: ActionCourriel.ACTION_REQUISE },
//     { label: 'Normal', value: ActionCourriel.NORMAL },
//     { label: 'Paye', value: ActionCourriel.PAYE },
//     { label: 'Approuve', value: ActionCourriel.APPROUVE }
// ]

