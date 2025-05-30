package ma.sir.ged.bean.core.parapheur.FicheParapheur;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;

import javax.persistence.*;

@Data
@Entity
public class ParapheurCertificateData {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    @JsonIgnore
    private Document document;

    private String documentKey;
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

    private boolean isUpdated = false;
}
