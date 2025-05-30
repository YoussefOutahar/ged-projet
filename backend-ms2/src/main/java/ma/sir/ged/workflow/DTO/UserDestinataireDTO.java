package ma.sir.ged.workflow.DTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import ma.sir.ged.ws.dto.UtilisateurDto;

@Data
public class UserDestinataireDTO {

    private Long id;
    private UtilisateurDto utilisateur;
    private int poids;
    private Long stepId;

    @JsonAlias("shouldSign")
    private boolean shouldSign;
}
