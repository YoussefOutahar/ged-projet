package ma.sir.ged.workflow.DTO;

import lombok.Data;
import ma.sir.ged.ws.dto.UtilisateurDto;

@Data
public class CommentaireDTO {
    private Long id;
    private UtilisateurDto utilisateur;
    private Long stepId;
    private String message;

}
