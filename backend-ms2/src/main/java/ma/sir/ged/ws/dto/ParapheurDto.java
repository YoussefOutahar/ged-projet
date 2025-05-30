package ma.sir.ged.ws.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import ma.sir.ged.bean.core.doc.Document;
import ma.sir.ged.ws.dto.summary.DocumentSummaryDto;
import ma.sir.ged.zynerator.audit.AuditBusinessObject;
import ma.sir.ged.zynerator.dto.AuditBaseDto;

import java.util.List;

@Data
public class ParapheurDto extends AuditBaseDto {

    private String title;
//    private List<DocumentSummaryDto> documents;
    //private List<Document> documents;
    private Boolean deleted;
    private String parapheurEtat;
    private UtilisateurDto utilisateur ;
    private List<UtilisateurDto> utilisateurDtos;

}
