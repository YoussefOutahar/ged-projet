interface ParapheurCertificateDataDTO {
    id: number;
    documentReference: string;
    designation: string;
    categorie: string;
    classeDeRisque: string;
    codeCE: string;
    nomDeMarque: string;
    etablissementDeFabrication: string;
    etablissementMarocain: string;
    sousTraitant: string;
    numeroDeReference: string;
    numeroDenregistrement: string;
    presentation: string;
}

interface ParapheurSignersDataDTO {
    id: number;
    name: string;
    userId: number | null;
}