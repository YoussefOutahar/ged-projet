package ma.sir.ged.ws.facade.admin.parapheur.Requests;

import lombok.Data;

@Data
public class ParapheurCertificateDataDTO {
    private Long id;
    private String documentReference;
    private String designation;
    private String categorie;
    private String classeDeRisque;
    private String codeCE;
    private String nomDeMarque;
    private String etablissementDeFabrication;
    private String etablissementMarocain;
    private String sousTraitant;
    private String numeroDeReference;
    private String numeroDenregistrement;
    private String presentation;
}
