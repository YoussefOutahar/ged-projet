package ma.sir.ged.ws.dto.summary;

import lombok.Data;

@Data
public class CreateCommentaireDto {
    private Long documentId;
    private String contenu;
}
