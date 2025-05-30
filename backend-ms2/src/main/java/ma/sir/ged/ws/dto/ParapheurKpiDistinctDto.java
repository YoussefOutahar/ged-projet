package ma.sir.ged.ws.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.sir.ged.bean.core.parapheur.ParapheurEtat;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParapheurKpiDistinctDto {
    private String title;
    private ParapheurEtat status;
    private int nombreDocumentTotal;
    private int nombreDocumentSigne;
    private int nombreDocumentNonSigne;
    private int nombreCommentaire;
    private int nombreUserAssocie;
}
