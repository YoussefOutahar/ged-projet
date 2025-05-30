package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SignedCertPerWorkflowDTO {
    private  String workflowPresetTitle;
    private  int signedCertifications;
    private  int totalCertifications;
}
