package ma.sir.ged.ws.dto.BureauOrdre;

import lombok.Data;
import ma.sir.ged.ws.dto.UtilisateurDto;

@Data
public class CourrielHistoryDto {
    private Long id;
    private String message;
    private String type;
    private String dateAction;
    private UtilisateurDto initiator;
    private CourrielDto courriel;
    private IntervenantsCourrielDto intervenant;
}
