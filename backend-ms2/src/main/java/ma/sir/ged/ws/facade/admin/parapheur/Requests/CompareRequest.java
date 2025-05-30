package ma.sir.ged.ws.facade.admin.parapheur.Requests;

import lombok.Data;
import ma.sir.ged.ws.dto.DocumentDto;

import java.util.List;

@Data
public class CompareRequest {
    private List<DocumentDto> stepDocuments;
    private Long workflowId;
}
