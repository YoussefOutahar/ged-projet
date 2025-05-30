package ma.sir.ged.workflow.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.sir.ged.workflow.entity.enums.WorkflowStatus;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkflowKPIDto {
    private String title;
    private WorkflowStatus status;
    private int nombreTotal;
    private long nombreEvaluateur;
    private List<EvaluateurCertifCountDTO> nombreCertifParEvaluateur;
    private int nombreCertifEnCours;
    private int nombreCertifRejete;
    private int nombreCertifSigne;
    private int reste;
}
