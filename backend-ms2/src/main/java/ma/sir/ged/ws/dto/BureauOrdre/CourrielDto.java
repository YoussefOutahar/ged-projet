package ma.sir.ged.ws.dto.BureauOrdre;

import java.util.List;
import java.util.Map;

import lombok.Data;
import ma.sir.ged.ws.dto.DocumentDto;
import ma.sir.ged.ws.dto.EntiteAdministrativeDto;

@Data
public class CourrielDto {
    private Long id;
    private String sujet;
    private String dateReception;
    private String dateEcheance;
    private String voieEnvoi;
    private String numeroRegistre;
    private String numeroCourriel;
    private String numeroCourrielExterne;
    private Boolean deleted = false;

    private String priorite;
    private String etatAvancement;
    private String type;
    private String confidentialite;

    private List<IntervenantsCourrielDto> intervenants;
    private PlanClassementBODto planClassement;
    private EtablissementDto entiteExterne;
    private EntiteAdministrativeDto entiteInterne;
    private List<DocumentDto> documents;
    private CourrielDto complement;
    private CourrielDto reponse;
    private long pereId;

    private Map<String, String> elements;
}
