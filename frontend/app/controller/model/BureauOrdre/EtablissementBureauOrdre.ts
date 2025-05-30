

export class EtablissementBureauOrdre {
    id: number | null ;
    nom: string = '';
    adresse: string = '';
    ville: string = '';
    pays: string = '';
    telephone: string = '';
    gsm: string = '';
    fax: string = '';
    statut: StatutEtablissement | null;
    secteur: string = '';
    email: string = '';
    deleted: boolean = false;

    // Constructor with default values
    constructor() {
        this.id = null;
        this.nom = '';
        this.adresse = '';
        this.ville = '';
        this.pays = '';
        this.telephone = '';
        this.gsm = '';
        this.fax = '';
        this.statut = null;
        this.secteur = '';
        this.email = '';
        this.deleted = false;
    }
}

export enum StatutEtablissement {
    PRIVE,
    PUBLIC,
    SEMI_PUBLIC
}